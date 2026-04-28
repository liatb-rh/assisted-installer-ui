## Self-Review

**Changes reviewed:** nmstateYaml.ts, nmstateTypes.ts, formDataToInfraEnvField.ts, dummyData.ts, nmstateYaml.test.ts

**Verified:**
- All three call sites to `getNmstateProtocolConfig` updated with the new `protocolVersion` parameter
- IPv6 configurations correctly include `autoconf: false` to disable SLAAC
- IPv4 configurations correctly omit the `autoconf` field (not applicable)
- Optional `autoconf` field properly typed in `NmstateProtocolConfig`
- TypeScript compilation passes with no errors
- Unit tests pass (2/2): separate test coverage for IPv4 and IPv6 behavior
- Code style verified with Prettier

**Fixed during review:** None
