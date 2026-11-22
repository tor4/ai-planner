The labelled rail on the right edge of every tablet and desktop screen; it chooses what the side panel shows.

- Items: Check in (with its count), Tasks, Proposals (only while a suggester run is open), Assistant (Should, only when enabled). Each is a Tabler icon over a `tab` label.
- The open item gets `aria-current="true"` and a citron icon pill. Choosing it again closes the panel.
- Width `rail` (88px) on `paper-sunken`. The panel beside it is `aip-panel`, `panel` wide (360px); on tablet it opens over the content and closes with Esc.
