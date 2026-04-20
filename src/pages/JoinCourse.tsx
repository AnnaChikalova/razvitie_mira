import { Link } from 'react-router-dom'
import '../App.css'
import { brand } from '../config'
import payImage from '../assets/pay.jpg'

export default function JoinCourse() {
  return (
    <div className="page">
      <section
        className="join-course-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.55) 100%), url(${payImage})`,
        }}
      >
        <div className="course-hero-content join-course-content">
          <h1 className="course-hero-headline">{brand.joinCourse.title}</h1>
          <div className="join-course-actions">
            <a className="btn primary" href={brand.joinCourse.basic.url} target="_blank" rel="noopener noreferrer">
              {brand.joinCourse.basic.label}
            </a>
            <a className="btn primary" href={brand.joinCourse.support.url} target="_blank" rel="noopener noreferrer">
              {brand.joinCourse.support.label}
            </a>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Link className="btn" to="/courses/mindfulness-101">Назад к курсу</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
