# Smart Traffic Signal Automation System

## Project Overview
The *Smart Traffic Signal Automation System* is an intelligent traffic management solution that automatically controls traffic lights based on real-time road conditions using camera input.

Unlike traditional fixed-timer signals, this system dynamically adjusts green light duration based on traffic density, helping to reduce congestion and improve road efficiency.

---

## Project Goal
The goal of this project is to build a computer program that:
- Analyzes live traffic video
- Counts vehicles on each road
- Automatically changes traffic signals
- Prioritizes emergency vehicles like ambulances and fire trucks

---

## Functional Requirements

### Vehicle Counting
- Detects and counts cars, trucks, and bikes in each lane using video input.

### Dynamic Traffic Light Control
- Adjusts green light duration based on vehicle count.
- Roads with more traffic receive longer green signals.

### Emergency Mode
- Detects emergency vehicles (ambulance/fire truck).
- Immediately switches the signal to green for priority passage.

###  Safety Timers
- Maintains a minimum green time (e.g., 5 seconds) even if traffic is low.
- Ensures pedestrian safety.

### Display Screen
- Shows:
  - Live camera feed
  - Vehicle count per lane
  - Countdown timer for signal changes

###  Manual Override
- Allows a traffic officer to manually control signals in special situations.

---

## Non-Functional Requirements

- *Real-Time Performance:*  
  Signal updates occur in under 1 second.

- *User-Friendly Interface:*  
  Simple display showing signal status clearly.

- *Offline Operation:*  
  Works without a constant internet connection.

- *Reliability & Fail-Safe Mode:*  
  If the camera fails, the system switches to a fixed-timer mode (e.g., 30 seconds per signal).

---

## Key Features
- Intelligent traffic signal control
- Emergency vehicle prioritization
- Real-time processing
- Manual override option
- Fail-safe fixed-timer mode

---

## Technologies Used
- *Programming Language:* Python  
- *Computer Vision:* OpenCV  
- *GUI:* Tkinter / PyQt  
- *Input Source:* Traffic camera / CCTV feed  

---

## How to Run the Project

```bash

git clone https://github.com/TusharKaushal100/Smart-Traffic-Signal-Automation-System.git


cd Smart-Traffic-Signal-Automation-System

--end
"""