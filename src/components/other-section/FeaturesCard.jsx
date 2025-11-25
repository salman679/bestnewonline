

const FeaturesCard = () => {
  return (
    <>
      <div>
        <div className="font-[sans-serif]  py-8 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="md:text-5xl text-3xl font-bold md:!leading-[55px] ">Supercharge Your Home with Our Professional Services</h2>
            <p className="mt-6 text-sm leading-relaxed ">Indulge in a seamless home experience as we deliver top-tier services, tailored to elevate your living space. From expert repairs to stunning renovations, our team is dedicated to turning your house into a home. With precision, passion, and the highest quality craftsmanship, we ensure your home service journey exceeds expectations.</p>
          </div>

          <div className="xl:max-w-7xl max-w-5xl mx-auto mt-12">
            <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-300 rounded">
                <h3 className="text-gray-800 text-xl font-bold mb-4">Unleash the Power of Customization</h3>
                <p className="text-sm text-gray-600">Elevate your home service experience with tailored solutions designed just for you. Our customization options allow you to craft the perfect service to suit your needs, ensuring every detail meets your exact specifications. From personalized designs to flexible features, we make your vision a reality with exceptional precision and care.</p>
                <button className="text-sm  bgColor px-4 py-2 tracking-wide mt-6 rounded">Read More</button>
              </div>
              <div className="p-6 bg-gray-300 rounded">
                <h3 className="text-gray-800 text-xl font-bold mb-4">Enhance Your Home's Security with Our Expert Services</h3>
                <p className="text-sm text-gray-600">Protect what matters most with our comprehensive security solutions. From smart systems to expert installations, we ensure your home stays safe and secure at all times. With cutting-edge technology and a dedicated team, we provide peace of mind so you can focus on what truly matters.</p>
                <button className="text-sm  bgColor px-4 py-2 tracking-wide mt-6 rounded">Read More</button>
              </div>
              <div className="p-6 bg-gray-300 rounded">
                <h3 className="text-gray-800 text-xl font-bold mb-4">Boost Your Home's Performance with Our Expert Solutions</h3>
                <p className="text-sm text-gray-600">Maximize your home’s efficiency with our performance-driven services. From energy-saving solutions to high-performance installations, we optimize every aspect of your home. Our expert team ensures seamless functionality, delivering long-lasting results that enhance both comfort and value.</p>
                <button className="text-sm  bgColor px-4 py-2 tracking-wide mt-6 rounded">Read More</button>
              </div>
              <div className="p-6 bg-gray-300 rounded">
                <h3 className="text-gray-800 text-xl font-bold mb-4">Reliable Support for All Your Home Service Needs</h3>
                <p className="text-sm text-gray-600">Our dedicated support team is here to assist you every step of the way. Whether it's troubleshooting, guidance, or expert advice, we provide continuous support to ensure your home service experience is smooth and stress-free. We’re just a call away, ready to help whenever you need us.</p>
                <button className="text-sm  bgColor px-4 py-2 tracking-wide mt-6 rounded">Read More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FeaturesCard