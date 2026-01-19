import Image from "next/image";
import remoteviewImg from "@/assets/images/remote-viewing.webp";
import safeImg from "@/assets/images/safeguard.webp";
import inspectionImg from "@/assets/images/property-Inspection.jpg";
import ReliImg from "@/assets/images/interior.webp";
import homeloan from "@/assets/images/homeloan.webp";
import interirImg from "@/assets/images/Documenation and legal expertise.jpg"

export default function rentalServices() {
  const services = [
    {
      title: "Remote Viewing (Seller + Buyer)",
      description: "We can give you a virtual tour of the property you're interested in or we can show your property to the interested buyers.",
      image: remoteviewImg
    },
    {
      title: "Property Inspection",
      description: "We do property inspection for you if you are looking to sell your property. We can inspect and detect if there's any changes and improvements needed.",
      image: inspectionImg
    },
    {
      title: "Documentation & Legal Expertise",
      description: "Our team of expert lawyers thoroughly checks and confirms the documents of any property you're interested in buying or selling, making sure all the paperworks is in order.",
      image: interirImg
    },
    {
      title: "Home loan",
      description: "Get financing solutions for your dream home with competitive rates and flexible repayment options.",
      image: homeloan
    },
    {
      title: "Financial safeguard",
      description: "To ensure financial security, we maintain an ESCROW account where the buyer deposits funds. These funds are only transferred to the seller's account once all documentation processes are duly completed.",
      image: safeImg
    },
    {
      title: "Interior design",
      description: "We believe that a house becomes a home when it reflects your personal style and comfort. Our Interior Design services are aimed at enhancing the aesthetics of your new home to match your unique taste and lifestyle.",
      image: ReliImg
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      <section
        className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20 lg:py-32"
        style={{
          backgroundImage: `url('/images/istockphoto-1409298953-612x612.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-6">
              NRBs Services by okobiz Property
            </h1>
            <p className="text-md lg:text-lg text-white text-justify leading-relaxed">
              As a non-resident Bangladeshi, buying or selling property in Bangladesh is a daunting task.
              But don&apos;t worry! Okobiz Property is here to make it easier for you. From remote property viewing to
              price negotiating, inspecting property personally to ownership transfer, we do everything we can
              to smoothen the whole process of your property-selling/buying journey.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl w-full  mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Management Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                Rental Management for NRBs
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                We understand that managing rent from far away can be very difficult for NRBs.
                When someone stays abroad and buys property in their home country, they will usually
                want to rent the property. But, managing rent from abroad can be a problematic task.
                But, Brokerage is here to help you with the right services.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 lg:p-12 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We are committed to customer satisfaction and have a proven record of success.
                You can rely on us to enjoy the best experience. We take care of every detail of
                your rental property, from finding and promoting tenants to drafting agreements
                and collecting rent.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      Extensive Promotion
                    </h4>
                    <p className="text-gray-600">
                      As a seller, the moment you enlist your property with us, we start extensive
                      promotion through our website and other social media platforms to ensure maximum exposure
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      Viewing & Agreement
                    </h4>
                    <p className="text-gray-600">
                      After promotional exposure, if any tenant shows interest in the property, we arrange
                      a viewing on behalf of our NRB customer. Then, if the tenant likes the property,
                      we take care of every step, from arranging the signing of the agreement paper to
                      handing over the key
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}







// import React from 'react';
// import {
//   Eye,
//   Search,
//   FileText,
//   CreditCard,
//   Shield,
//   Palette,
//   Key,
//   Users,
//   TrendingUp,
//   Globe,
//   Phone,
//   ArrowRight
// } from 'lucide-react';


// const NRBServices = () => {
//   const services = [
//     {
//       icon: <Eye className="w-8 h-8" />,
//       title: "Remote Viewing (Seller + Buyer)",
//       description: "We can give you a virtual tour of the property you're interested in or we can show your property to the interested buyers."
//     },
//     {
//       icon: <Search className="w-8 h-8" />,
//       title: "Property Inspection",
//       description: "We do property inspection for you if you are looking to sell your property. We can inspect and detect if there's any changes and improvements needed."
//     },
//     {
//       icon: <FileText className="w-8 h-8" />,
//       title: "Documentation & Legal Expertise",
//       description: "Our team of expert lawyers thoroughly checks and confirms the documents of any property you're interested in buying or selling, making sure all the paperworks is in order."
//     },
//     {
//       icon: <CreditCard className="w-8 h-8" />,
//       title: "Home Loan",
//       description: "We assist you in securing home loans with competitive rates and flexible terms tailored for Non-Resident Bangladeshis."
//     },
//     {
//       icon: <Shield className="w-8 h-8" />,
//       title: "Financial Safeguard",
//       description: "To ensure financial security, we maintain an ESCROW account where the buyer deposits funds. These funds are only transferred to the seller's account once all documentation processes are duly completed."
//     },
//     {
//       icon: <Palette className="w-8 h-8" />,
//       title: "Interior Design",
//       description: "We believe that a house becomes a home when it reflects your personal style and comfort. Our Interior Design services are aimed at enhancing the aesthetics of your new home to match your unique taste and lifestyle."
//     }
//   ];

//   const rentalServices = [
//     {
//       icon: <Key className="w-6 h-6" />,
//       title: "Property Management",
//       description: "Complete management of your rental property from finding tenants to maintenance"
//     },
//     {
//       icon: <Users className="w-6 h-6" />,
//       title: "Tenant Screening",
//       description: "Thorough background checks and verification of potential tenants"
//     },
//     {
//       icon: <FileText className="w-6 h-6" />,
//       title: "Agreement Drafting",
//       description: "Professional rental agreements that protect your interests"
//     },
//     {
//       icon: <TrendingUp className="w-6 h-6" />,
//       title: "Rent Collection",
//       description: "Regular rent collection and financial reporting to keep you updated"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">

//       <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
//         {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
//         <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl font-bold mb-6">
//               NRB Services
//             </h1>
//             <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
//               Comprehensive Real Estate Solutions for Non-Resident Bangladeshis
//             </p>
//             <div className="flex items-center justify-center space-x-2 text-lg">
//               <Globe className="w-6 h-6" />
//               <span>Bridging Distance, Building Dreams</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="Container mx-auto  py-16">
//         {/* Introduction */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//             Making Property Investment Easy for NRBs
//           </h2>
//           <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
//             As a non-resident Bangladeshi, buying or selling property in Bangladesh is a daunting task.
//             But don&#39;t worry! Brokerage is here to make it easier for you. From remote property viewing to
//             price negotiating, inspecting property personally to ownership transfer, we do everything we can
//             to smoothen the whole process of your property-selling/buying journey.
//           </p>
//         </div>

//         {/* Services Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
//           {services.map((service, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500"
//             >
//               <div className="text-blue-600 mb-4">
//                 {service.icon}
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 {service.title}
//               </h3>
//               <p className="text-gray-600 leading-relaxed">
//                 {service.description}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Rental Management Section */}
//         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-16">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//               Rental Property Management
//             </h2>
//             <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
//               We understand that managing rent from far away can be very difficult for NRBs. When someone
//               stays abroad and buys property in their home country, they will usually want to rent the property.
//               But, managing rent from abroad can be a problematic task. But, Brokerage is here to help you with the right services.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {rentalServices.map((service, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
//               >
//                 <div className="text-blue-600 mb-3">
//                   {service.icon}
//                 </div>
//                 <h4 className="font-semibold text-gray-900 mb-2">
//                   {service.title}
//                 </h4>
//                 <p className="text-sm text-gray-600">
//                   {service.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Process Steps */}
//         <div className="mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
//             Our Simple Process
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl font-bold text-blue-600">1</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">Property Listing</h3>
//               <p className="text-gray-600">
//                 As a seller, the moment you enlist your property with us, we start extensive promotion
//                 through our website and other social media platforms to ensure maximum exposure.
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl font-bold text-blue-600">2</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">Tenant Viewing</h3>
//               <p className="text-gray-600">
//                 After promotional exposure, if any tenant shows interest in the property, we arrange
//                 a viewing on behalf of our NRB customer.
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl font-bold text-blue-600">3</span>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">Agreement & Handover</h3>
//               <p className="text-gray-600">
//                 If the tenant likes the property, we take care of every step, from arranging the
//                 signing of the agreement paper to handing over the key.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Why Choose Us */}
//         <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
//           <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
//             Why Choose Our NRB Services?
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-6">
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-100 p-2 rounded-full mt-1">
//                   <Shield className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">Proven Track Record</h4>
//                   <p className="text-gray-600">We are committed to customer satisfaction and have a proven record of success.</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-100 p-2 rounded-full mt-1">
//                   <Users className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">Expert Team</h4>
//                   <p className="text-gray-600">Our team of professionals handles every detail with expertise and care.</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-100 p-2 rounded-full mt-1">
//                   <Globe className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">Global Reach</h4>
//                   <p className="text-gray-600">We understand the unique needs of Non-Resident Bangladeshis worldwide.</p>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-6">
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-100 p-2 rounded-full mt-1">
//                   <FileText className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">Legal Compliance</h4>
//                   <p className="text-gray-600">All transactions are handled with complete legal compliance and transparency.</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-100 p-2 rounded-full mt-1">
//                   <Phone className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">24/7 Support</h4>
//                   <p className="text-gray-600">Round-the-clock support to assist you across different time zones.</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-100 p-2 rounded-full mt-1">
//                   <TrendingUp className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">Maximum Returns</h4>
//                   <p className="text-gray-600">We ensure you get the best value for your property investments.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Call to Action */}
//         <div className="text-center mt-16">
//           <h2 className="text-3xl font-bold text-gray-900 mb-6">
//             Ready to Get Started?
//           </h2>
//           <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
//             Let us help you navigate the Bangladesh real estate market from anywhere in the world.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center justify-center">
//               Contact Us Today
//               <ArrowRight className="w-5 h-5 ml-2" />
//             </button>
//             <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-8 rounded-lg transition duration-200">
//               View Properties
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NRBServices;