#  SautiCare – Speak Well, Live Well

SautiCare is an **inclusive speech tutor app** designed for learners with speech impairments in Kenya.  
It combines **Automatic Speech Recognition (ASR)** and **Text-to-Speech (TTS)** technologies to guide learners through interactive **nutrition and hygiene micro-lessons**, helping them build both **speech clarity** and **health literacy**.  

The app works **online and offline**, supports **Kenyan English and Swahili**, and is designed for use **under teacher or guardian supervision**.

---

##  Features

- **ASR-powered speech tutor** – speech-to-text transcription with pronunciation assessment.  
-  **TTS lesson playback** – plays target nutrition & hygiene phrases for learners to repeat.  
-  **Micro-lessons** – focused on everyday vocabulary: fruits, foods, and hygiene practices.  
-  **Offline-first design** – local storage with sync when internet is available.  
-  **Teacher/Guardian Dashboard** – progress tracking, transcripts, and feedback reports.  
-  **Privacy & Ethics** – anonymized, consent-based data collection; no commercial exploitation.  

---

##  System Flow

```text
+--------------------+
| User Profile Setup |
+---------+----------+
          |
          v
+--------------------------+
| Baseline Speech Sample   |
| (personalization)        |
+-----------+--------------+
            |
            v
+----------------------------+
| Nutrition & Hygiene Lessons|
+-----------+----------------+
            |
            v
+----------------------------+
| Interaction Loop per Unit  |
+----------------------------+
| 1. TTS plays target phrase |
| 2. Learner speaks/reads    |
| 3. STT transcribes input   |
| 4. Pronunciation Assess.   |
| 5. Feedback generated      |
+-----------+----------------+
            |
            v
+----------------------------+
| Adaptation Engine          |
| - Update skill path        |
| - Adjust difficulty        |
| - Fine-tune to learner     |
+-----------+----------------+
            |
            v
+----------------------------+         +-----------------------+
| Local Progress Storage     |<------->| Offline Sync Module   |
+-----------+----------------+         +-----------------------+
            |
            v
+----------------------------+
| Teacher Dashboard / Review |
+----------------------------+
```

