import { CollapseWithArrow, SectionTitle } from '../components'
import faq from '../utils/faqQuestions'

const Faq = () => {
  return (
    <>
      <SectionTitle text='Q&A' />
      {faq.map((item) => {
        return (
          <CollapseWithArrow
            key={item.id}
            title={item.question}
            content={item.answer}
          />
        )
      })}
    </>
  )
}

export default Faq
