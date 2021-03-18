import {
  BareMetalDiscoveryValues,
  HostSubnets,
  NetworkConfigurationValues,
} from '../../types/clusters';
import { Cluster, ClusterDefaultConfig, Inventory } from '../../api/types';
import { stringToJSON } from '../../api/utils';
import { Address4, Address6 } from 'ip-address';
import { getHostname } from '../hosts/utils';
import { NO_SUBNET_SET } from '../../config/constants';

export const getSubnet = (cidr: string): Address6 | Address4 | null => {
  if (Address4.isValid(cidr)) {
    return new Address4(cidr);
  } else if (Address6.isValid(cidr)) {
    return new Address6(cidr);
  } else {
    return null;
  }
};

const getHumanizedSubnet = (subnet: Address6 | Address4 | null) => {
  if (subnet) {
    const subnetStart = subnet.startAddress().correctForm();
    const subnetEnd = subnet.endAddress().correctForm();
    return `${subnet.address} (${subnetStart} - ${subnetEnd})`;
  }

  return '';
};

export const getHostSubnets = (cluster: Cluster): HostSubnets => {
  const hostnameMap: { [id: string]: string } =
    cluster.hosts?.reduce((acc, host) => {
      const inventory = stringToJSON<Inventory>(host.inventory) || {};
      acc = {
        ...acc,
        [host.id]: getHostname(host, inventory),
      };
      return acc;
    }, {}) || {};

  return (
    cluster.hostNetworks?.map((hn) => {
      return {
        subnet: hn.cidr || '',
        hostIDs: hn.hostIds?.map((id) => hostnameMap[id] || id) || [],
        humanized: getHumanizedSubnet(getSubnet(hn.cidr as string)),
      };
    }) || []
  );
};

export const getSubnetFromMachineNetworkCidr = (machineNetworkCidr?: string) => {
  if (!machineNetworkCidr) {
    return NO_SUBNET_SET;
  }

  const subnet = getSubnet(machineNetworkCidr);
  return getHumanizedSubnet(subnet);
};

export const isAdvConf = (cluster: Cluster, defaultNetworkSettings: ClusterDefaultConfig) =>
  cluster.clusterNetworkCidr !== defaultNetworkSettings.clusterNetworkCidr ||
  cluster.clusterNetworkHostPrefix !== defaultNetworkSettings.clusterNetworkHostPrefix ||
  cluster.serviceNetworkCidr !== defaultNetworkSettings.serviceNetworkCidr;

export const getBareMetalDiscoveryInitialValues = (cluster: Cluster): BareMetalDiscoveryValues => {
  const monitoredOperators = cluster.monitoredOperators || [];
  return {
    useExtraDisksForLocalStorage: !!monitoredOperators.find((operator) => operator.name === 'ocs'),
  };
};

export const getNetworkInitialValues = (
  cluster: Cluster,
  defaultNetworkSettings: ClusterDefaultConfig,
): NetworkConfigurationValues => {
  return {
    clusterNetworkCidr: cluster.clusterNetworkCidr || defaultNetworkSettings.clusterNetworkCidr,
    clusterNetworkHostPrefix:
      cluster.clusterNetworkHostPrefix || defaultNetworkSettings.clusterNetworkHostPrefix,
    serviceNetworkCidr: cluster.serviceNetworkCidr || defaultNetworkSettings.serviceNetworkCidr,
    apiVip: cluster.apiVip || '',
    ingressVip: cluster.ingressVip || '',
    sshPublicKey: cluster.sshPublicKey || '',
    hostSubnet: getSubnetFromMachineNetworkCidr(cluster.machineNetworkCidr),
    shareDiscoverySshKey:
      !!cluster.imageInfo.sshPublicKey && cluster.sshPublicKey === cluster.imageInfo.sshPublicKey,
    vipDhcpAllocation: cluster.vipDhcpAllocation,
  };
};
