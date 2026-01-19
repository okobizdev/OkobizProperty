"use client";

import React, { useState } from "react";
import { Button, Steps, Card } from "antd";
import { ArrowLeftOutlined, HomeOutlined, FormOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import CategorySelector from "@/components/listing/CategorySelector";
import ListingForm from "@/components/listing/ListingForm";

const { Step } = Steps;

const AddListing = () => {
    const router = useRouter();
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubcategorySelect = (subcategoryId: string | null) => {
        setSelectedSubcategoryId(subcategoryId);
        if (subcategoryId) {
            setCurrentStep(1);
        } else {
            setCurrentStep(0);
        }
    };

    const handleFormSubmit = () => {
        setCurrentStep(2);
        setIsSubmitted(true);
    };

    const steps = [
        {
            title: 'Step 1',
            description: 'Select property type',
            icon: <HomeOutlined />,
        },
        {
            title: 'Step 2',
            description: 'Fill in your property information',
            icon: <FormOutlined />,
        },
        {
            title: 'Complete',
            description: 'Property submitted successfully',
            icon: <CheckCircleOutlined />,
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.back()}
                                className="flex items-center hover:bg-gray-100 border-gray-300 flex-shrink-0"
                                size="middle"
                            >
                                Back
                            </Button>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl  md:text-3xl font-bold text-gray-900 truncate">Sell/Rent Your Property</h1>
                                <p className="text-sm md:text-base text-gray-600 mt-1">Share your space with travelers around the world</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 sm:hidden">
                            <span>Step {currentStep + 1} of {steps.length}</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                            <span>Step {currentStep + 1} of {steps.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-[77rem] mx-auto  lg:px-8 py-4 sm:py-8">
                <Card className="w-full  shadow-sm">
                    <Steps
                        current={currentStep}
                        className="mb-0"
                        direction="horizontal"
                        size="small"
                        responsive={false}
                        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                    >
                        {steps.map((step, index) => (
                            <Step
                                key={index}
                                title={
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-xs hidden md:block md:text-sm">{step.icon}</span>
                                        <span className="text-xs md:text-sm">{step.title}</span>
                                    </div>
                                }
                                description={
                                    <span className="text-xs sm:text-sm hidden sm:block">
                                        {step.description}
                                    </span>
                                }
                            />
                        ))}
                    </Steps>
                </Card>



                <div className="space-y-6 sm:space-y-8">

                    <Card
                        className="shadow-lg border-0"
                        bodyStyle={{ padding: '1rem sm:2rem' }}
                    >
                        {currentStep === 0 && (
                            <div>
                                <CategorySelector onSubcategorySelect={handleSubcategorySelect} />
                            </div>
                        )}


                        {currentStep === 1 && selectedSubcategoryId && (
                            <div>
                                <div className="text-center mb-6 sm:mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 px-2">
                                        Tell us about your property
                                    </h2>
                                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2">
                                        Provide detailed information to help guests understand what makes your property special.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg gap-3 sm:gap-0">
                                    <Button
                                        onClick={() => {
                                            setCurrentStep(0);
                                            setSelectedSubcategoryId(null);
                                        }}
                                        className="flex items-center w-full sm:w-auto"
                                        size="middle"
                                    >
                                        <ArrowLeftOutlined className="mr-2" />
                                        Change Category
                                    </Button>
                                    <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
                                        Fill out all required fields to continue
                                    </div>
                                </div>

                                <ListingForm subcategoryId={selectedSubcategoryId} onSubmitSuccess={handleFormSubmit} />
                            </div>
                        )}


                        {currentStep === 2 && isSubmitted && (
                            <div className="text-center py-8 sm:py-12 px-2">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                                    <CheckCircleOutlined className="text-4xl sm:text-6xl text-green-500" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                                    Property Submitted Successfully!
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
                                    Your property has been submitted for review. We&#39;ll notify you once it&#39;s approved and live on our platform.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                    <Button
                                        size="large"
                                        onClick={() => router.push('/host-dashboard/listed-properties')}
                                        className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                                    >
                                        View My Properties
                                    </Button>
                                    <Button
                                        size="large"
                                        onClick={() => {
                                            setCurrentStep(0);
                                            setSelectedSubcategoryId(null);
                                            setIsSubmitted(false);
                                        }}
                                        className="w-full sm:w-auto"
                                    >
                                        Add Another Property
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>


                    <Card className="bg-blue-50 border-blue-200 shadow-sm">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Pro Tips for Success</h3>
                                <ul className="text-blue-800 space-y-1 text-sm">
                                    <li>• Add high-quality photos to attract more guests</li>
                                    <li>• Write a detailed description highlighting unique features</li>
                                    <li>• Set competitive pricing based on similar properties</li>
                                    <li>• Keep your calendar updated for better visibility</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Footer Help */}
                <div className="text-center mt-8 sm:mt-12 pb-6 sm:pb-8 px-3">
                    <p className="text-gray-500 text-sm sm:text-base">
                        Need help? Contact our support team at{' '}
                        <a href="mailto:info@okobiz.com" className="text-blue-600 hover:text-blue-700 break-all">
                            info@okobiz.com
                        </a>
                    </p>
                    <p >01904108303</p>
                </div>
            </div>
        </div>
    );
};

export default AddListing;