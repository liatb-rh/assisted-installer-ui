import { describe, it, expect } from 'vitest';
import { getNmstateProtocolConfig } from './nmstateYaml';
import { ProtocolVersion } from './dataTypes';

describe('nmstateYaml', () => {
  describe('getNmstateProtocolConfig', () => {
    it('should include autoconf: false for IPv6 static configuration', () => {
      const ipv6Config = getNmstateProtocolConfig('2001:db8::1', 64, ProtocolVersion.ipv6);

      expect(ipv6Config).toEqual({
        address: [
          {
            ip: '2001:db8::1',
            'prefix-length': 64,
          },
        ],
        enabled: true,
        dhcp: false,
        autoconf: false,
      });
    });

    it('should not include autoconf for IPv4 configuration', () => {
      const ipv4Config = getNmstateProtocolConfig('192.168.1.10', 24, ProtocolVersion.ipv4);

      expect(ipv4Config).toEqual({
        address: [
          {
            ip: '192.168.1.10',
            'prefix-length': 24,
          },
        ],
        enabled: true,
        dhcp: false,
      });
    });
  });
});
