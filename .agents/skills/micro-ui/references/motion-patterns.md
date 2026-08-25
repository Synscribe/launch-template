# Motion patterns

Twenty patterns, each built and in production. Pick by what the feature _claims_, then check the
set for duplicates — no two visuals in one set should move the same way.

Reference implementations ship in `examples/` — a full set lives alongside the kit in whatever
project it was built for. The five copied into
`examples/` are the ones worth reading first, one per container archetype.

## Quick reference

| Pattern                 | The claim it carries                                | Container              | Built as          |
| ----------------------- | --------------------------------------------------- | ---------------------- | ----------------- |
| **Console checklist**   | a procedure completing correctly, live              | card                   | `OutboundCall` ★  |
| **Narrowing funnel**    | volume filtered down to what matters                | bars                   | `InboundCall` ★   |
| **Converging sources**  | scattered context assembling into one thing         | card + floating chips  | `Personalisation` |
| **Drawn thread**        | history connecting to the present moment            | timeline               | `Memory`          |
| **Type-and-retrieve**   | a question answered from a real source              | search UI              | `Knowledge`       |
| **Rolling counters**    | improvement accruing over time                      | stat row + bar         | `Learning`        |
| **Radiating transfer**  | one thing propagating to many                       | node diagram           | `CloneReps` ★     |
| **Branching flow**      | one input fanning into several outputs              | drawn tree             | `Summarise`       |
| **Running highlighter** | a document being read and marked                    | transcript             | `Qa`              |
| **Channel switch**      | one context moving across surfaces                  | segmented control      | `Messaging`       |
| **Streaming queue**     | backlog being worked through                        | list rows              | `Callback`        |
| **Sweep and re-rank**   | a score changing the order of things                | ring + reordering list | `SignalScore`     |
| **Question to query**   | natural language becoming machine work              | editor + chart         | `DataAnalyst`     |
| **In-place masking**    | data being transformed where it sits                | field list             | `Redaction`       |
| **Orbit and latch**     | an ecosystem connecting to a hub                    | orbit                  | `CrmIntegration`  |
| **Text morph**          | the same thing rendered many ways                   | quote card             | `Multilingual` ★  |
| **Continuous dial**     | coverage without gaps                               | 24h dial               | `AlwaysOn`        |
| **Drawing rail**        | a short, ordered path to an outcome                 | timeline               | `Managed`         |
| **Descending scan**     | a list being audited line by line                   | checklist              | `Security`        |
| **Live feed**           | a system that is running right now                  | dashboard              | `Dashboard` ★     |
| **Two-sided dialogue**  | the product itself, not a feature — for a page hero | wide plate             | `HeroVisual` ★    |

★ = copied into `examples/`.

**A page hero is not one of the set.** The twenty each argue one feature; a hero
argues the product. Give it a structurally different container — `HeroVisual`
is the only one built on a two-sided dialogue and a time axis — and keep it out
of the id→component registry, since no capability selects it.

## Notes on the ones that are easy to get wrong

**Console checklist** — the steps must tick in sequence, not appear pre-ticked. The payoff (an
amount, an outcome) lands _after_ the last tick, or the sequence has no point.

**Narrowing funnel** — bars fill left-to-right with `scaleX` and a per-tier delay; counters run
alongside. Give the last tier a different accent, since it is the tier the copy is about.

**Converging sources** — chips start offset and outside the card and spring inward. If they
simply fade in, you have built a static diagram with a fade, which is not this pattern.

**Radiating transfer** — animate `cx`/`cy` on real circles travelling the connector lines, then
pop the destination on arrival. The travel is the claim; the endpoints alone are not.

**Sweep and re-rank** — leads arrive in call order and _reorder_ into score order via layout
animation. The reorder is the whole idea; a pre-sorted list says nothing.

**In-place masking** — mask character by character with the leading characters kept. Swapping
the whole string in one frame reads as a cut, not as redaction.

**Orbit and latch** — the orbit is ambient and slow (40s+). The latching is phase-driven. Keep
those two clocks separate or the orbit stutters every phase.

**Live feed** — rows enter from the top on their own interval, independent of the loop, and the
list is clipped to exactly `rows × row height`.

## Adding a new pattern

If none of the twenty fits, build a new one rather than bending a close-enough pattern — but
write it into this table afterwards, with the claim it carries and the component that
demonstrates it. A pattern that is not written down here gets rebuilt slightly differently next
time, and the set stops feeling like a set.
