// import Link from "next/link"
// import clientPromise from "@/lib/mongodb"
// import { notFound } from "next/navigation";

// export default async function Page({ params }) {
//     const handle = (await params).handle
//     const client = await clientPromise;
//     const db = client.db("bittree")
//     const collection = db.collection("links")

//     // If the handle is already claimed, you cannot create the bittree
//     const item = await collection.findOne({handle: handle})
//     if(!item){
//         return notFound()
//     }

//     console.log(item)

//     const item2 = {
//         "_id": {
//             "$oid": "6729e97390cf30c8f66c4c68"
//         },
//         "links": [
//             {
//                 "link": "https://www.instagram.com/codewithharry/?hl=en",
//                 "linktext": "Instagram"
//             },
//             {
//                 "link": "https://www.codewithharry.com",
//                 "linktext": "Website"
//             },
//             {
//                 "link": "https://www.YouTube.com/codewithharry/?hl=en",
//                 "linktext": "YouTube"
//             }
//         ],
//         "handle": "harry",
//         "pic": "https://avatars.githubusercontent.com/u/48705673?v=4"
//     }
//     return <div className="flex min-h-screen bg-purple-400 justify-center items-start py-10 ">
//         {item && <div className="photo flex justify-center flex-col items-center gap-4  w-[200px]"> 
//             <img src={item.pic} alt="" />
//             <span className="font-bold text-xl">@{item.handle}</span>
//             <span className="desc w-80 text-center">{item.desc}</span>
//             <div className="links">
//                 {item.links.map((item, index)=>{
//                     return <Link  key={index} href= {item.link} ><div className="bg-purple-100 py-4 shadow-lg px-2 min-w-96 flex justify-center rounded-md my-3">
//                        {item.linktext}
                       
//                     </div></Link> 
//                 })}
//             </div>
//       </div>}
//     </div>
// }


import Link from "next/link"
import clientPromise from "@/lib/mongodb"
import { notFound } from "next/navigation";
import { FaInstagram, FaFacebook, FaYoutube, FaGithub,FaGoogle, FaGlobe } from 'react-icons/fa';

export default async function Page({ params }) {
    const handle = (await params).handle
    const client = await clientPromise;
    const db = client.db("bittree")
    const collection = db.collection("links")

    // If the handle is already claimed, you cannot create the bittree
    const item = await collection.findOne({handle: handle})
    if(!item){
        return notFound()
    }

    // Function to get appropriate icon for link
    const getLinkIcon = (linkText, linkUrl) => {
        const text = linkText.toLowerCase();
        const url = linkUrl.toLowerCase();
        
        if (text.includes('instagram') || url.includes('instagram')) {
            return <FaInstagram className="text-pink-600 text-xl" />;
        } else if (text.includes('facebook') || url.includes('facebook')) {
            return <FaFacebook className="text-blue-600 text-xl" />;
        } else if (text.includes('youtube') || url.includes('youtube')) {
            return <FaYoutube className="text-red-600 text-xl" />;
        } else if (text.includes('github') || url.includes('github')) {
            return <FaGithub className="text-gray-800 text-xl" />;
        } else if (text.includes('google') || url.includes('google')) {
            return <FaGoogle className="text-gray-800 text-xl" />;
        } else {
            return <FaGlobe className="text-gray-600 text-xl" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                {item && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                        {/* Profile Section */}
                        <div className="flex flex-col items-center mb-8">
                            {/* Profile Image */}
                            <div className="relative mb-4">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-75"></div>
                                <img 
                                    src={item.pic} 
                                    alt={item.handle}
                                    className="relative w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
                                />
                            </div>
                            
                            {/* Handle */}
                            <span className="text-white font-bold text-2xl mb-2 bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
                                @{item.handle}
                            </span>
                            
                            {/* Description */}
                            {item.desc && (
                                <p className="text-white/90 text-center max-w-md bg-black/10 px-6 py-3 rounded-xl backdrop-blur-sm">
                                    {item.desc}
                                </p>
                            )}
                        </div>

                        {/* Links Section */}
                        <div className="space-y-4">
                            {item.links.map((linkItem, index) => {
                                return (
                                    <Link 
                                        key={index} 
                                        href={linkItem.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                                    >
                                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-4 flex items-center gap-4 border-2 border-transparent hover:border-purple-300 group">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
                                                {getLinkIcon(linkItem.linktext, linkItem.link)}
                                            </div>
                                            
                                            {/* Link Text */}
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-gray-800 text-lg">
                                                    {linkItem.linktext}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                                    {linkItem.link.replace(/(^\w+:|^)\/\//, '')}
                                                </p>
                                            </div>
                                            
                                            {/* Arrow Icon */}
                                            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-all">
                                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm">
                                🌟 Powered by LinkTree-Clone
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

