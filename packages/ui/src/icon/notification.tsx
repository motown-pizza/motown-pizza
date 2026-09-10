import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { Variant } from '@repo/types';
import { IconCheck, IconExclamationMark, IconInfoCircle, IconX } from '@tabler/icons-react';

export function IconNotification({ variant }: { variant: Variant }) {
  const iconProps = {
    icon: IconInfoCircle,
  };

  switch (variant) {
    case Variant.FAILED:
      iconProps.icon = IconX;
      break;
    case Variant.WARNING:
      iconProps.icon = IconExclamationMark;
      break;
    case Variant.SUCCESS:
      iconProps.icon = IconCheck;
      break;
  }

  return <iconProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />;
}
