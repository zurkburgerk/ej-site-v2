import { Block } from 'payload'

export const ModelBlock: Block = {
  slug: 'modelBlock',
  labels: {
    singular: '3D Model',
    plural: '3D Models',
  },
  fields: [
    {
      name: 'model',
      type: 'relationship',
      relationTo: 'models',
      required: true,
      label: '3D Model',
    },
    {
      name: 'height',
      type: 'number',
      label: 'Canvas Height (px)',
      defaultValue: 400,
    },
    {
      name: 'transition',
      type: 'select',
      label: 'Transition',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'From Right', value: 'fromRight' },
        { label: 'From Left', value: 'fromLeft' },
      ],
    },
    {
      name: 'autoRotate',
      type: 'checkbox',
      label: 'Auto Rotate',
      defaultValue: false,
    },
    {
      name: 'fadeIn',
      type: 'checkbox',
      label: 'Fade In',
      defaultValue: false,
    },
    {
      name: 'trackMouse',
      type: 'checkbox',
      label: 'Track Mouse',
      defaultValue: false,
    },
  ],
}
