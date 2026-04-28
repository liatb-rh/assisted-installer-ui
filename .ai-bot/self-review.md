## Self-Review

**Changes reviewed:**
- `nmstateYaml.ts` - Added protocolVersion parameter, conditionally adds `autoconf: false` for IPv6
- `nmstateTypes.ts` - Added optional `autoconf` field
- `dummyData.ts` - Updated function call with `ProtocolVersion.ipv4`
- `formDataToInfraEnvField.ts` - Updated two function calls with `protocolVersion` parameter
- `nmstateYaml.test.ts` - Added unit tests

**Verified:**
- All 3 call sites to `getNmstateProtocolConfig` were updated with the new parameter
- TypeScript type checking passes
- Code style conforms to Prettier standards
- Unit tests pass (2 tests covering IPv4 and IPv6 scenarios)
- IPv6 configs correctly include `autoconf: false` to disable SLAAC
- IPv4 configs correctly exclude the `autoconf` field (not applicable)
- No edge cases with null/undefined (protocolVersion is always a valid enum value)

**Fixed during review:** Staged the test file which was initially untracked
