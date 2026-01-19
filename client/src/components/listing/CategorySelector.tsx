"use client"
import { apiBaseUrl } from '@/config/config';
import { Category } from '@/types/propertyTypes';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface Subcategory {
    id: string;
    name: string;
    image?: string;
}

interface CategoryWithSubs extends Category {
    _id: string;
    name: string;
    image?: string;
    description?: string;
    subcategories?: Subcategory[];
}

interface CategorySelectorProps {
    onSubcategorySelect: (subcategoryId: string | null) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSubcategorySelect }) => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithSubs | null>(null);
    const subcategoryRef = useRef<HTMLDivElement>(null);

    const selectCategory = (category: CategoryWithSubs) => {
        setSelectedCategory(category);


        setTimeout(() => {
            if (subcategoryRef.current) {
                subcategoryRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                setTimeout(() => {
                    window.scrollBy({ top: -120, behavior: "smooth" });
                }, 400);
            }
        }, 300);
    };

    const selectSubcategory = (subcategoryId: string) => {
        onSubcategorySelect(subcategoryId);
    };

    const { data: categories } = useQuery<CategoryWithSubs[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await fetch(`${apiBaseUrl}/categories`);
            if (!response.ok) throw new Error("Failed to fetch categories");
            const data = await response.json();
            return Array.isArray(data) ? data : data.categories || data.data || [];
        },
    });

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center">Select Category</h2>

            {/* Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {categories?.map((category) => (
                    <div
                        key={category?._id}
                        onClick={() => selectCategory(category)}
                        className={`group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 ${selectedCategory?._id === category._id
                            ? 'border-2 border-red-300 shadow-xl bg-blue-50'
                            : selectedCategory
                                ? 'border-1 border-gray-300 opacity-50 cursor-not-allowed'
                                : 'border-1 border-gray-200 hover:border-red-400 hover:shadow-xl bg-white'
                            }`}
                    >
                        <div className="p-4 sm:p-6 text-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden shadow-lg">
                                {category?.image ? (
                                    <Image
                                        src={apiBaseUrl + category.image}
                                        alt={category.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            if (target.nextElementSibling) {
                                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                            }
                                        }}
                                    />
                                ) : null}
                                <div
                                    className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl"
                                    style={{ display: category?.image ? 'none' : 'flex' }}
                                >
                                    {category?.name?.charAt(0)}
                                </div>
                            </div>

                            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2">{category?.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{category?.description}</p>

                            {selectedCategory?._id === category._id && (
                                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-400 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>


            {selectedCategory && (
                <div ref={subcategoryRef} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">
                        Select {selectedCategory.name} Type
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {selectedCategory?.subcategories?.map((sub: Subcategory) => (
                            <div
                                key={sub.id}
                                onClick={() => selectSubcategory(sub.id)}
                                className="group relative p-3 sm:p-4 border-2 border-gray-200 rounded-lg cursor-pointer text-center hover:border-red-300 hover:shadow-lg transform transition-all duration-300 hover:scale-105 bg-white"
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-lg overflow-hidden shadow-md">
                                    {sub?.image ? (
                                        <Image
                                            src={apiBaseUrl + sub.image}
                                            alt={sub.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                if (target.nextElementSibling) {
                                                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg"
                                        style={{ display: sub?.image ? 'none' : 'flex' }}
                                    >
                                        {sub?.name?.charAt(0)}
                                    </div>
                                </div>

                                <p className="font-semibold text-gray-800 text-xs sm:text-sm group-hover:text-green-700 line-clamp-2">
                                    {sub?.name}
                                </p>

                                <div className="absolute inset-0 bg-green-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedCategory && (
                <div className="text-center mt-4 sm:mt-6">
                    <button
                        onClick={() => {
                            setSelectedCategory(null);
                            onSubcategorySelect(null);
                        }}
                        className="px-4 py-2 sm:px-6 sm:py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors duration-300 shadow-lg text-sm sm:text-base"
                    >
                        Reset Selection
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategorySelector;
