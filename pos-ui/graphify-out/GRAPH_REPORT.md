# Graph Report - pos-ui  (2026-05-10)

## Corpus Check
- 9 files · ~121,026 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 31 nodes · 32 edges · 2 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 7 edges
2. `getMerchantDetail()` - 3 edges
3. `tryGetMerchantDetail()` - 3 edges
4. `handleScreenKey()` - 3 edges
5. `padRight()` - 2 edges
6. `padLeft()` - 2 edges
7. `removeVietnameseTones()` - 2 edges
8. `sendIsoMessage()` - 2 edges
9. `parseIsoResponse()` - 2 edges
10. `runFraudTestAuthorization()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.38
Nodes (9): getMerchantDetail(), padLeft(), padRight(), parseIsoResponse(), POST(), removeVietnameseTones(), runFraudTestAuthorization(), sendIsoMessage() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.67
Nodes (3): handlePointerDown(), handleScreenKey(), processPayment()

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._