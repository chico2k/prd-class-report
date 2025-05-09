import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import styled from "@emotion/styled";
import { colors } from "../../config/colors";

const StyledSwitch = styled(SwitchPrimitives.Root)`
  display: inline-flex;
  height: 1.25rem;
  width: 2.25rem;
  flex-shrink: 0;
  cursor: pointer;
  align-items: center;
  border-radius: 9999px;
  border: 2px solid transparent;
  box-shadow: 0 1px 2px 0 ${colors.borderLight};
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.primaryLight};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[data-state="checked"] {
    background-color: ${colors.primary};
  }

  &[data-state="unchecked"] {
    background-color: ${colors.border};
  }
`;

const StyledThumb = styled(SwitchPrimitives.Thumb)`
  pointer-events: none;
  display: block;
  height: 1rem;
  width: 1rem;
  border-radius: 9999px;
  background-color: ${colors.cardBackground};
  box-shadow: 0 1px 3px 0 ${colors.borderLight};
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  &[data-state="checked"] {
    transform: translateX(1rem);
  }

  &[data-state="unchecked"] {
    transform: translateX(0);
  }
`;

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <StyledSwitch {...props} ref={ref}>
    <StyledThumb />
  </StyledSwitch>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
