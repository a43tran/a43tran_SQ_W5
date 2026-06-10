# Week 5 Example 1 — Sprite Sheet Animation

## What This Example Demonstrates

> **Note for students:** This section is included in example files only to help you study. Do not include it in your Side Quest submissions.

This example introduces sprite sheet animation by loading a single image file and drawing one frame at a time to create a walking character that faces the correct direction.

- **Sprite sheet** — a single image containing all animation frames arranged in a grid; one row per direction, one column per frame
- **`preload()`** — loads the sprite sheet image before `setup()` runs so it is ready to use immediately
- **`imageMode(CENTER)`** — makes `image()` draw from the centre point rather than the top-left corner; useful for positioning characters
- **`image()` with source rectangle** — the 9-argument version of `image()` lets you specify which part of a larger image to draw; used here to extract one frame from the sheet
- **Frame selection** — multiplying `currentFrame` by `frameWidth` slides the source window along the row to select the correct frame
- **Row selection** — multiplying the row index by `frameHeight` moves the source window to the correct direction row
- **`frameTimer`** — counts up every `draw()` call; when it reaches `animSpeed`, the frame advances; this controls how fast the animation plays independently of the frame rate
- **`isMoving` flag** — animation only plays when the player is moving; resets to frame 0 when idle so the character stands still
- **`SPRITE` config object** — groups all sprite settings in one place so they are easy to adjust without hunting through the code
- **`offsets`** — fine-tune the source position per direction to correct misaligned frames on a sprite sheet

## Setup and Interaction Instructions

To run the sketch locally, open `index.html` in Google Chrome using Live Server.

**Controls:** WASD to move in all four directions.

The HUD shows the current direction, frame number, and row — useful for tuning your own sprite sheet.

**Opening the Chrome Console**

- **Windows:** Press `F12` or `Ctrl + Shift + J`, then click the **Console** tab
- **Mac:** Press `Cmd + Option + J`

The console will show any errors in your sketch.

## Assets

| File | Source |
|------|--------|
| `assets/images/walking.png` | Slynyrd, Pixelblog 22: Top Down Character Sprites |

## References

Slynyrd. 2019. *Pixelblog 22: Top Down Character Sprites*. Slynyrd Blog. Retrieved May 1, 2026, from https://www.slynyrd.com/blog/2019/10/21/pixelblog-22-top-down-character-sprites
