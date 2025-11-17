import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const About = () => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section with Image Banner */}
      <section className="hero min-h-[50vh] sm:min-h-[60vh] relative overflow-hidden bg-base-200">
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-shrink-0 w-full sm:w-auto"
          >
            <div className="relative rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto lg:mx-0">
              <img
                src="/images/art.jpg"
                alt="Art Gallery Banner"
                className="w-full h-auto max-w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-grow text-center lg:text-left w-full"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 sm:mb-6 md:mb-8 text-base-content/90 px-2 sm:px-0">
              This page shows the paintings of famous artists.
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              A platform to share famous art around the world.
            </p>
            
            {/* Read More Button */}
            {!showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={() => setShowDetails(true)}
                  className="btn btn-primary btn-sm sm:btn-md md:btn-lg gap-2 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Read more about us"
                >
                  <span className="text-xs sm:text-sm md:text-base">Read More</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Detailed Content - Expandable */}
      <AnimatePresence>
        {showDetails && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden bg-base-200 py-8 sm:py-12 md:py-16"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card bg-base-100 shadow-2xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 lg:p-12"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 md:mb-10 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    About Us
                  </h1>

                  {/* Our Mission Section */}
                  <div className="mb-8 sm:mb-10 md:mb-12 space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="divider">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide">
                        Our Mission
                      </h2>
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-primary">
                      Our journey starts with U.
                    </h3>
                    
                    <div className="space-y-3 sm:space-y-4 md:space-y-5 text-sm sm:text-base md:text-lg leading-relaxed prose prose-lg max-w-none">
                      <p className="text-base-content/90">
                        Since the gallery's inception in September 2013, Unit London has established itself as a global artistic platform for the world's most distinctive talent. In an often opaque and unaccommodating art market, Unit London has sought to identify, cultivate and expose works of art on a meritocratic basis. The gallery has successfully launched and advanced the careers of numerous important contemporary artists and remains firmly committed to its driving principles of equity, innovation and accessibility.
                      </p>
                      
                      <p className="text-base-content/90">
                        The gallery is forthright in its dedication to be an open and transparent institution at the forefront of an expanding and diversifying art industry. As a consequence of its boldly independent approach to the gallery model, Unit London has become synonymous with a pioneering use of social media and digital content. The gallery endeavours to act as a platform; a stage upon which the stories of today's most gifted artists can be told, whilst bridging the gap between the physical and virtual spheres of modern experience; connecting people with the art they love.
                      </p>
                      
                      <p className="text-base-content/90">
                        In actively engaging with its growing audience of millions worldwide, the gallery hopes to carve out a more significant role for the creative and visual arts in the future of our societies - firmly believing that mass engagement with art can play a critical role in cultivating creative thought. A more creative world will be better placed to solve the significant challenges it will face in the future. Championing art and creativity to the broadest possible audience is, and will continue to be, the gallery's core, driving mission.
                      </p>
                    </div>
                  </div>

                  {/* Our Founders Section */}
                  <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="divider">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide">
                        Our Founders
                      </h2>
                    </div>
                    <blockquote className="border-l-4 border-primary pl-3 sm:pl-4 md:pl-6 py-3 sm:py-4 bg-base-200 rounded-r-lg">
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold italic text-base-content/90">
                        "We were both painters so we've always had a real appreciation for artists working in that medium."
                      </p>
                    </blockquote>
                    
                    <div className="space-y-3 sm:space-y-4 md:space-y-5 text-sm sm:text-base md:text-lg leading-relaxed">
                      <p className="text-base-content/90">
                        Unit London was founded on the enterprising spirit of close childhood friends Joe Kennedy and Jonny Burt. Frustrated by the prohibitive and confounding industry mechanisms that restrict broad access to the art world for artists, enthusiasts, and would-be collectors alike, Joe and Jonny opened a small pop-up gallery space in an empty charity shop at the ages of 22 and 23, determined to build a business that encouraged access, engagement and opportunity for committed and talented artists. As young gallery owners initially showing their own paintings, they set out to develop a roster of international artists that embodied a shifting global culture of information sharing and global connectivity. The pair were, and are, uniquely placed to influence the evolution of the art industry and play a significant part in realigning its ingrained value systems through the relentless and purposeful championing of exceptional artist talent.
                      </p>
                      
                      <p className="text-base-content/90">
                        Today, Joe and Jonny lead a diverse and multi-talented team of individuals in their London gallery who share in the mission of supporting the world's most exciting artists, and making their work accessible to the widest possible audience - in the ultimate pursuit of making art a more practical and valuable aspect of our world's cultures and societies.
                      </p>
                    </div>
                  </div>

                  {/* Collapse Button */}
                  <div className="text-center mt-6 sm:mt-8 md:mt-10 pt-6 sm:pt-8 border-t border-base-300">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="btn btn-outline btn-sm sm:btn-md md:btn-lg gap-2 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Show less content"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm md:text-base">Show Less</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Team Section - Always Visible */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Our Team
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-base-content/70 max-w-2xl mx-auto px-2">
                Meet the dedicated individuals who make our gallery a vibrant space for art lovers
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  title: 'Curator',
                  description: 'Leading our artistic vision and curation efforts',
                  icon: '🎨'
                },
                {
                  title: 'Technical Director',
                  description: 'Ensuring seamless digital experiences for our users',
                  icon: '💻'
                },
                {
                  title: 'Community Manager',
                  description: 'Building connections between artists and art lovers',
                  icon: '🤝'
                },
                {
                  title: 'Content Team',
                  description: 'Creating engaging articles and stories about art',
                  icon: '✍️'
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="card-body text-center items-center p-4 sm:p-6">
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{member.icon}</div>
                    <h3 className="card-title text-base sm:text-lg md:text-xl mb-2">{member.title}</h3>
                    <p className="text-xs sm:text-sm text-base-content/70">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Explore?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 text-base-content/80 px-2">
              Start your journey through our collection of amazing artworks
            </p>
            <Link
              to="/gallery"
              className="btn btn-primary btn-sm sm:btn-md md:btn-lg gap-2 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Visit gallery"
            >
              <span className="text-xs sm:text-sm md:text-base">Visit Gallery</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
