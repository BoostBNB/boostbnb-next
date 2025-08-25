"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const IndividualListingPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [listing, setListing] = useState<any>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const fetchListing = async () => {
           const supabase = await createClient();

            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError) {
                console.error("Error fetching user:", userError);
                router.back();
                return;
            }

            console.log("Current ID: ", id);
            const { data, error } = await supabase.rpc("get_listing_from_request_id", { request_id: id, user_id_: user?.id });

            if (error) {
                console.error("Error fetching listing:", error);
                return;
            }

            console.log("Fetched listing:", data);
            setListing(data[0]);
        };

        fetchListing();
    }, [id]);

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading listing...</p>
                </div>
            </div>
        );
    }

    const property = listing.data.property;

    return (
        <div className="w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <button 
                    onClick={() => router.back()}
                    className="mb-4 border-1 border-black p-2 hover:bg-gray-300 cursor-pointer"
                >
                    ← Back to listings
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-medium">{property.rating}</span>
                        <span>({property.reviews} reviews)</span>
                    </div>
                    <span className="hidden sm:block">•</span>
                    <span>{property.guestCapacity} guests</span>
                </div>
            </div>

            {/* Photo Gallery */}
            <div className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-64 sm:h-80 lg:h-[400px]">
                    <div className="relative rounded-lg overflow-hidden">
                        <Image
                            src={property.photos[selectedImageIndex]}
                            alt={`${property.title} - Main`}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="hidden lg:grid grid-cols-2 gap-2">
                        {property.photos.slice(1, 5).map((photo: string, index: number) => (
                            <div 
                                key={index}
                                className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImageIndex(index + 1)}
                            >
                                <Image
                                    src={photo}
                                    alt={`${property.title} - ${index + 2}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Photo thumbnails */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {property.photos.map((photo: string, index: number) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative rounded-md overflow-hidden border-2 transition-all ${
                                selectedImageIndex === index ? 'border-rose-500' : 'border-transparent'
                            }`}
                        >
                            <Image
                                src={photo}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="space-y-8">
                {/* Host Info and Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Host Info */}
                    <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                <Image
                                    src={property.host.profilePhoto}
                                    alt={property.host.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold">Hosted by {property.host.name}</h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                    {property.host.isSuperhost && (
                                        <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-medium">
                                            Superhost
                                        </span>
                                    )}
                                    <span>{property.host.yearsHosting} years hosting</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-yellow-400">★</span>
                            <span className="font-medium">{property.host.rating}</span>
                            <span className="text-gray-600">({property.host.reviews} reviews)</span>
                        </div>

                        {/* Co-hosts */}
                        {property.host.cohosts && property.host.cohosts.length > 0 && (
                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-medium mb-3">Co-hosts</h4>
                                <div className="flex gap-3">
                                    {property.host.cohosts.map((cohost: any, index: number) => (
                                        <div key={index} className="text-center">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden mx-auto mb-1">
                                                <Image
                                                    src={cohost.profilePhoto}
                                                    alt={cohost.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-xs text-gray-600">{cohost.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Rating:</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">★</span>
                                    <span className="font-medium">{property.rating}</span>
                                    <span className="text-gray-600 text-sm">({property.reviews} reviews)</span>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Guest capacity:</span>
                                <span className="font-medium">{property.guestCapacity} guests</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Property ID:</span>
                                <span className="font-medium text-sm">{property.id}</span>
                            </div>
                            {property.latitude && property.longitude && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Latitude:</span>
                                        <span className="font-medium text-sm">{property.latitude.toFixed(6)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Longitude:</span>
                                        <span className="font-medium text-sm">{property.longitude.toFixed(6)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4">About this place</h3>
                    <div 
                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ 
                            __html: property.description.replace(/<br\s*\/?>/gi, '<br>') 
                        }}
                    />
                </div>

                {/* Amenities and Safety Features */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Amenities */}
                    <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                        <div className="space-y-3">
                            {property.amenities
                                .filter((amenity: any) => amenity.available)
                                .slice(0, 8)
                                .map((amenity: any, index: number) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 text-gray-600 flex-shrink-0">
                                        {getAmenityIcon(amenity.type)}
                                    </div>
                                    <span className="text-gray-900 text-sm">{amenity.title}</span>
                                </div>
                            ))}
                        </div>
                        {property.amenities.filter((amenity: any) => amenity.available).length > 8 && (
                            <button className="mt-4 p-2 border-1 border-black hover:bg-gray-300 cursor-pointer">
                                Show all {property.amenities.filter((amenity: any) => amenity.available).length} amenities
                            </button>
                        )}
                    </div>

                    {/* Safety Features */}
                    <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-4">Safety features</h3>
                        <div className="space-y-3">
                            {property.safetyAndPropertyInfo.map((safety: any, index: number) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 text-green-600 flex-shrink-0">
                                        <svg fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-900 text-sm">{safety.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to get amenity icons
const getAmenityIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
        'SYSTEM_WI_FI': '📶',
        'SYSTEM_COOKING_BASICS': '🍳',
        'SYSTEM_TV': '📺',
        'SYSTEM_SNOWFLAKE': '❄️',
        'SYSTEM_THERMOMETER': '🌡️',
        'SYSTEM_HAIRDRYER': '💨',
        'SYSTEM_IRON': '👔',
        'SYSTEM_COFFEE_MAKER': '☕',
        'SYSTEM_DETECTOR_SMOKE': '🚨',
        'SYSTEM_DETECTOR_CO': '⚠️',
        'SYSTEM_FIRE_EXTINGUISHER': '🧯',
        'SYSTEM_FIRST_AID_KIT': '🏥',
    };
    
    return iconMap[type] || '✓';
};

export default IndividualListingPage;