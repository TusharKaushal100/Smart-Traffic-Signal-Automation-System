"""
prepare_data.py
───────────────
Converts UA-DETRAC XML annotations into a simple CSV:
    image_path, vehicle_count

Then splits into train/val sets.

UA-DETRAC structure after extraction:
    dataset/
    ├── DETRAC-Train-Images/
    │   ├── MVI_20011/
    │   │   ├── img00001.jpg
    │   │   ├── img00002.jpg
    │   │   └── ...
    │   └── MVI_20012/ ...
    └── DETRAC-Train-Annotations-XML/
        ├── MVI_20011.xml
        ├── MVI_20012.xml
        └── ...
"""

import os
import xml.etree.ElementTree as ET
import pandas as pd
from sklearn.model_selection import train_test_split
import argparse


def parse_detrac_xml(xml_path: str) -> dict:
    """
    Parse one UA-DETRAC XML file.
    Returns: {frame_number: vehicle_count}
    """
    frame_counts = {}

    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()

        for frame in root.findall(".//frame"):
            frame_num = int(frame.get("num", 0))
            # Count all target boxes in this frame
            vehicles = frame.findall(".//target_list/target")
            frame_counts[frame_num] = len(vehicles)

    except Exception as e:
        print(f"  [WARN] Could not parse {xml_path}: {e}")

    return frame_counts


def build_dataset(
    images_dir: str,
    annotations_dir: str,
    output_csv: str = "dataset/dataset.csv",
    max_frames_per_seq: int = 50  # limit frames per sequence to avoid huge dataset
):
    """
    Walk through all sequences and build image_path → vehicle_count CSV.
    """

    records = []
    sequences = sorted(os.listdir(images_dir))

    print(f"[INFO] Found {len(sequences)} sequences")

    for seq_name in sequences:
        seq_img_dir = os.path.join(images_dir, seq_name)
        xml_file    = os.path.join(annotations_dir, f"{seq_name}.xml")

        if not os.path.isdir(seq_img_dir):
            continue
        if not os.path.exists(xml_file):
            print(f"  [SKIP] No annotation for {seq_name}")
            continue
    
        frame_counts = parse_detrac_xml(xml_file)

        if not frame_counts:
            continue

        # Get all jpg images sorted
        images = sorted([
            f for f in os.listdir(seq_img_dir)
            if f.endswith(".jpg") or f.endswith(".png")
        ])

        added = 0
        for img_file in images:
            if added >= max_frames_per_seq:
                break

            # UA-DETRAC frame naming: img00001.jpg → frame 1
            try:
                frame_num = int(img_file.replace("img", "").split(".")[0])
            except:
                continue

            count = frame_counts.get(frame_num, 0)
            img_path = os.path.join(seq_img_dir, img_file)

            records.append({
                "image_path": img_path,
                "vehicle_count": count
            })
            added += 1

        print(f"  [OK] {seq_name}: {added} frames added")

    df = pd.DataFrame(records)
    print(f"\n[INFO] Total records: {len(df)}")
    print(f"[INFO] Vehicle count stats:\n{df['vehicle_count'].describe()}")

    # Split train/val 80:20
    train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    df.to_csv(output_csv, index=False)

    train_csv = output_csv.replace(".csv", "_train.csv")
    val_csv   = output_csv.replace(".csv", "_val.csv")

    train_df.to_csv(train_csv, index=False)
    val_df.to_csv(val_csv, index=False)

    print(f"\n[DONE] Saved:")
    print(f"  Full  : {output_csv}  ({len(df)} rows)")
    print(f"  Train : {train_csv}   ({len(train_df)} rows)")
    print(f"  Val   : {val_csv}     ({len(val_df)} rows)")

    return train_csv, val_csv


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--images",      default="dataset/DETRAC-Train-Images",
                        help="Path to DETRAC-Train-Images folder")
    parser.add_argument("--annotations", default="dataset/DETRAC-Train-Annotations-XML",
                        help="Path to DETRAC-Train-Annotations-XML folder")
    parser.add_argument("--output",      default="dataset/dataset.csv")
    parser.add_argument("--max_frames",  type=int, default=50,
                        help="Max frames per sequence (default 50)")
    args = parser.parse_args()

    build_dataset(
        images_dir      = args.images,
        annotations_dir = args.annotations,
        output_csv      = args.output,
        max_frames_per_seq = args.max_frames
    )
