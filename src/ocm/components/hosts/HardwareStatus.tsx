import React from 'react';
import { Host, HostStatus } from '../../../common';
import { ValidationsInfo } from '../../../common/types/hosts';
import {
  getFailingClusterWizardSoftValidationIds,
  getWizardStepHostStatus,
  getWizardStepHostValidationsInfo,
  wizardStepsValidationsMap,
} from '../clusterWizard/wizardTransition';
import { AdditionalNTPSourcesDialogToggle } from './AdditionaNTPSourceDialogToggle';

type HardwareStatusProps = {
  host: Host;
  validationsInfo: ValidationsInfo;
  onEditHostname?: () => void;
};

const HardwareStatus: React.FC<HardwareStatusProps> = (props) => {
  const hardwareStatus = getWizardStepHostStatus(
    'host-discovery',
    wizardStepsValidationsMap,
    props.host,
  );
  const validationsInfo = getWizardStepHostValidationsInfo(props.validationsInfo, 'host-discovery');
  const sublabel = getFailingClusterWizardSoftValidationIds(validationsInfo, 'host-discovery')
    .length
    ? 'Some validations failed'
    : undefined;

  return (
    <HostStatus
      {...props}
      statusOverride={hardwareStatus}
      validationsInfo={validationsInfo}
      sublabel={sublabel}
      AdditionalNTPSourcesDialogToggleComponent={AdditionalNTPSourcesDialogToggle}
    />
  );
};

export default HardwareStatus;
