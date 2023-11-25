import React from 'react'
import Nav from '../components/Home/Navbar'
import First_block from '../components/homepage/first_block'
import Navbar from '../components/usedbyall/Navbar'
import CoursesSection from '../components/homepage/cour'
import DemandPage from '../components/homepage/Demand'
import Launchpad from '../components/homepage/Launchpad'
import Section5 from '../components/homepage/Section5'
import Section6 from '../components/homepage/section6'
import Section7 from '../components/homepage/section7'

const home = () => {
  return (
    <div>
<Nav/>
<Navbar/>
<CoursesSection/>
<DemandPage/>
<Launchpad/>
<Section5/>
<Section6/>
<Section7/>
    </div>
  )
}

export default home