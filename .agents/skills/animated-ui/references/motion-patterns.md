# Motion patterns

| Pattern                   | Use when                                                | Preferred mechanism                           |
| ------------------------- | ------------------------------------------------------- | --------------------------------------------- |
| One-time emphasis         | A state becomes ready, checked, or selected             | Short CSS keyframe                            |
| Sequential flow           | A small process has a meaningful order                  | Staggered CSS delays or a tiny state machine  |
| Ambient field             | The background needs depth without carrying meaning     | Slow transform/opacity CSS                    |
| State transition          | A user action changes a panel, tab, or disclosure       | CSS transition tied to native state           |
| Path or handoff           | Direction between nodes is important                    | Connector emphasis or translated marker       |
| Scroll-linked explanation | Content and visual genuinely depend on reading progress | Native scroll APIs; add JS only when required |

## Timing defaults

Treat these as starting points, not a new token system:

- state feedback: 120–220ms;
- small entrance: 280–500ms;
- short sequence: under 1.5s total;
- ambient loop: 6–14s, low distance and low contrast.

Use ease-out for arrivals and ease-in-out for ambient loops. Avoid elastic or spring-like movement unless it matches the client's brand and does not undermine trust.

## Reduced-motion composition

- render the final state immediately;
- remove looping transforms;
- retain borders, labels, icons, and other non-motion state cues;
- avoid replacing an animation with a flash or abrupt opacity change;
- test the actual media query, not only a code review.
