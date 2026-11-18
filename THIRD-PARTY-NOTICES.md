# Third-party notices

bot.computer is licensed under the Apache License, Version 2.0 (see `LICENSE`).
It ships with the following third-party material, each under its own license.

## CMU Pronouncing Dictionary

The speech engine in `vendor/tts/tts.wasm` contains a pronunciation lexicon and
letter-to-sound rules derived from the CMU Pronouncing Dictionary.
License: BSD 2-Clause.

```
Copyright (C) 1993-2015 Carnegie Mellon University. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
   The contents of this file are deemed to be source code.

2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in
   the documentation and/or other materials provided with the
   distribution.

This work was supported in part by funding from the Defense Advanced
Research Projects Agency, the Office of Naval Research and the National
Science Foundation of the United States of America, and by member
companies of the Carnegie Mellon Sphinx Speech Consortium. We acknowledge
the contributions of many volunteers to the expansion and improvement of
this dictionary.

THIS SOFTWARE IS PROVIDED BY CARNEGIE MELLON UNIVERSITY ``AS IS'' AND
ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL CARNEGIE MELLON UNIVERSITY
NOR ITS EMPLOYEES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

## NVIDIA Conformer-CTC speech model

The speech recognizer in `vendor/stt/stt.wasm`, used by the conversation page
(`conversation/`), contains the weights of NVIDIA's `stt_en_conformer_ctc_small`
speech recognition model (https://huggingface.co/nvidia/stt_en_conformer_ctc_small),
trained by NVIDIA on its NeMo ASRSET 2.0 collection of English speech.
License: Creative Commons Attribution 4.0 International (CC-BY-4.0),
https://creativecommons.org/licenses/by/4.0/.

Changes made in the stt project (https://github.com/f2i-com/stt): the linear and
convolution weights are quantized to 8-bit integers with one scale per output
row, depthwise-convolution batch normalization is folded into the convolution
weights and biases, and the subsampling convolution layouts are pre-transposed.
No weights were retrained.

## CMU ARCTIC speech databases

The speaker profiles in `vendor/tts/profiles/arctic_*.json` are acoustic
measurements (pitch, vocal tract length and formant settings) taken from the
CMU ARCTIC speech databases by the Language Technologies Institute at Carnegie
Mellon University (http://festvox.org/cmu_arctic/). No recordings are included.

## Instrument Serif

The landing page uses a Latin subset of Instrument Serif Italic by the Instrument Serif Project Authors, distributed under the SIL Open Font License 1.1. The license accompanies the font in `vendor/fonts/OFL-Instrument-Serif.txt`.

## Bricolage Grotesque

The heading typeface in `vendor/fonts/bricolage-grotesque-latin-wght.woff2`.
License: SIL Open Font License 1.1. The full text is in
`vendor/fonts/OFL-Bricolage-Grotesque.txt`.

## Lucide icons

The line icons in `index.html` and `src/embed-widget-core.js` are adapted from
Lucide (https://lucide.dev). Some Lucide icons are in turn derived from Feather.
License: ISC, with the Feather-derived icons under MIT.

```
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

```
The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
