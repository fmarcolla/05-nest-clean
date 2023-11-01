import { Slug } from './slug'

test('it should be able to create a new slug from text', () => {
  const slugText = Slug.createFromText('Example question title')

  expect(slugText.value).toEqual('example-question-title')
})
