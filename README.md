# Padonan Loft — Media Assets

Drop your files into the correct folders below.
The website will automatically use them — no code changes needed.

---

## 📁 public/img/ — Required Photos

| Filename             | What to put here                                      | Min Size       |
|----------------------|-------------------------------------------------------|----------------|
| hero.jpg             | Best wide interior shot (living area, golden hour)    | 1920 × 1080 px |
| livingroom.jpg       | Living room — wide angle, full space visible          | 1200 × 800 px  |
| kitchen.jpg          | Kitchen — main gallery large image (left slot)        | 1200 × 800 px  |
| bedroom-master.jpg   | Master bedroom — right gallery top slot               | 800 × 600 px   |
| bedroom-second.jpg   | Second bedroom — right gallery bottom slot            | 800 × 600 px   |
| bathroom.jpg         | Bathroom — used in the features/detail section        | 800 × 600 px   |
| og.jpg               | Facebook/WhatsApp link preview image                  | 1200 × 630 px  |

## 📁 public/video/ — Required Video

| Filename        | What to put here                                                          | Format       |
|-----------------|---------------------------------------------------------------------------|--------------|
| intro.mp4       | Walkthrough/cinematic video — plays on page load (muted, autoplay loop)   | MP4, H.264   |
| intro.webm      | Same video in WebM format (for better browser compatibility — optional)    | WebM, VP9    |

---

## Tips

- Keep photo file sizes under 500KB each (use squoosh.app to compress)
- Video should be under 15MB for fast loading (use handbrake.fr to compress)
- All filenames must be lowercase with no spaces
- JPG format recommended for photos
- The video plays silently on entry — it does NOT need audio

---

## How to Deploy on Netlify

1. Make sure this entire `loft-site` folder contains:
   - index.html
   - public/img/ (with your photos)
   - public/video/ (with your video)

2. Go to netlify.com
3. Drag the entire `loft-site` folder onto the deploy zone
4. Done — your site is live in 30 seconds
