# Trivial space website

Website code for https://www.trivialspace.net.

Build with typescript, solid.js, tailwindcss and css scroll-driven animations.

To get the code of all WebGL sketches and experiments, visit
https://github.com/trivial-space/sketches.

## Thumbnails

Work thumbnails live in `src/data/imgs/` as WebP, max 1200px wide, quality 75.
They are displayed blurred and at most 1100px wide, so no higher resolution is
needed. Convert a source image with:

```sh
cwebp -q 75 -m 6 -resize 1200 0 source.png -o src/data/imgs/<slug>.webp
```

Then add the work to `src/data/data.ts`, with the width and height of the source
image (used for the aspect ratio).

## License

MIT, see the LICENSE file in the repository.

Copyright (c) 2023 Thomas Gorny
