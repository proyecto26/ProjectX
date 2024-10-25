import type { Meta, StoryObj } from '@storybook/react';
import { CloseIcon } from './Close';

const meta: Meta<typeof CloseIcon> = {
  component: CloseIcon,
  title: 'Icons/Close',
  args: {
    className: 'w-20 h-20 bg-blue-500',
    color: 'white',
  },
};
export default meta;
type Story = StoryObj<typeof CloseIcon>;

export const Primary: Story = {
  render: (args) => (
    <div className="min-h-screen flex flex-col h-40 w-full justify-center items-center gap-x-10 bg-medium">
      <CloseIcon {...args} />
    </div>
  ),
};

