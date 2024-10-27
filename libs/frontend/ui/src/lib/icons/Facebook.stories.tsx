import type { Meta, StoryObj } from '@storybook/react';
import { FacebookIcon } from './Facebook';

const meta: Meta<typeof FacebookIcon> = {
  component: FacebookIcon,
  title: 'Icons/Facebook',
  args: {
    className: 'w-20 h-20 bg-blue-500',
    color: 'white',
  },
};
export default meta;
type Story = StoryObj<typeof FacebookIcon>;

export const Primary: Story = {
  render: (args) => (
    <div className="min-h-screen flex flex-col h-40 w-full justify-center items-center gap-x-10 bg-medium">
      <FacebookIcon {...args} />
    </div>
  ),
};
