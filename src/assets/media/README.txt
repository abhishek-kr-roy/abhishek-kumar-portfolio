HOW TO ADD PHOTOS AND CLIPS
===========================

Drop files into the matching folder. They appear in the Media section automatically
(run `npm run build` again before deploying).

  field-visits/          -> "Field visits" filter
  farmer-conversations/  -> "Farmer conversations" filter
  yukti/                 -> "YUKTI" filter
  dsyf/                  -> "DSYF 2026" filter
  clips/                 -> general videos (all videos also show under "Clips")

Supported: .jpg .jpeg .png .webp .avif .gif  |  .mp4 .webm .mov .m4v
(iPhone .HEIC photos: export/convert to .jpg first.)

The file name becomes the caption, and a number prefix sets the order:
  01-stall-at-dsyf.jpg            -> "Stall at DSYF"
  02-pitch-to-the-jury.mp4        -> "Pitch to the jury"

Keep photos under ~1 MB (about 1600px wide) and clips under ~20 MB so the site stays fast.
Full-quality source copies are kept in media-originals/ at the project root, outside the site assets.
Video preview images go in posters/ with the same base name as the clip and a .jpg extension.
The archive keeps portrait and landscape framing; clips only play when opened.
