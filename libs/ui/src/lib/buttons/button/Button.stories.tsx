import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Buttons/Button',
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: (args) => (
    <div className="flex h-40 w-full flex-row items-center justify-center gap-x-10 bg-medium">
      <Button {...args}>Hello World</Button>
    </div>
  ),
};
