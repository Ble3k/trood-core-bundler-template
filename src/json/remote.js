export default [
  { name: 'div', props: { children: 'Remote component' } },
  {
    name: 'Remote',
    props: {
      url:
        'https://raw.githubusercontent.com/Paciolan/remote-component/master/examples/remote-components/Time.js',
    },
  },
]