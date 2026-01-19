"use client"
import React, { useState, useCallback, useMemo } from 'react';

const EMICalculator = () => {
    const [principalAmount, setPrincipalAmount] = useState(500000);
    const [interestRate, setInterestRate] = useState(5);
    const [loanTenure, setLoanTenure] = useState(5);
    const [startDate, setStartDate] = useState('2025-09-18');

    // Calculate first EMI date using useCallback
    const getFirstEMIDate = useCallback(() => {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split('T')[0];
    }, [startDate]);

    // Calculate EMI using the standard formula with useCallback
    const calculateEMI = useCallback(() => {
        const P = principalAmount; // Principal amount
        const r = interestRate / 12 / 100; // Monthly interest rate
        const n = loanTenure * 12; // Total number of months

        if (r === 0) {
            // If interest rate is 0, EMI is simply principal divided by months
            const emi = P / n;
            return {
                monthlyEMI: emi,
                yearlyPayment: emi * 12,
                totalInterest: 0,
                totalPayment: P,
                firstEMIDate: getFirstEMIDate()
            };
        }

        // EMI = P × [r × (1 + r)^n] / [(1 + r)^n - 1]
        const emi = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        return {
            monthlyEMI: emi,
            yearlyPayment: emi * 12,
            totalInterest: totalInterest,
            totalPayment: totalPayment,
            firstEMIDate: getFirstEMIDate()
        };
    }, [principalAmount, interestRate, loanTenure, getFirstEMIDate]);

    // Memoized results to avoid unnecessary recalculations
    const results = useMemo(() => calculateEMI(), [calculateEMI]);

    // Format currency with useCallback to prevent re-creation on every render
    const formatCurrency = useCallback((amount: any) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replace('BDT', 'Tk');
    }, []);

    // Format date with useCallback
    const formatDate = useCallback((dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('/').reverse().join('-');
    }, []);

    // Event handlers using useCallback
    const handlePrincipalChange = useCallback((value: any) => {
        setPrincipalAmount(Number(value));
    }, []);

    const handleInterestRateChange = useCallback((value: any) => {
        setInterestRate(Number(value));
    }, []);

    const handleLoanTenureChange = useCallback((value: any) => {
        setLoanTenure(Number(value));
    }, []);

    const handleStartDateChange = useCallback((value: any) => {
        setStartDate(value);
    }, []);

    return (
        <div className=" py-8">
            <div className="max-w-5xl w-full shadow-lg mx-auto  rounded-lg p-8 ">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">
                    EMI Calculator
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Principal Loan Amount (Tk)
                            </label>
                            <input
                                type="number"
                                value={principalAmount}
                                onChange={(e) => handlePrincipalChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                min="0"
                            />
                            <input
                                type="range"
                                min="100000"
                                max="10000000"
                                step="50000"
                                value={principalAmount}
                                onChange={(e) => handlePrincipalChange(e.target.value)}
                                className="w-full mt-3 accent-blue-500"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Annual Interest Rate (%)
                            </label>
                            <input
                                type="number"
                                value={interestRate}
                                onChange={(e) => handleInterestRateChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                min="0"
                                max="30"
                                step="0.1"
                            />
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => handleInterestRateChange(e.target.value)}
                                className="w-full mt-3 accent-blue-500"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loan Tenure (Years)
                            </label>
                            <input
                                type="number"
                                value={loanTenure}
                                onChange={(e) => handleLoanTenureChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                min="1"
                                max="30"
                            />
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={loanTenure}
                                onChange={(e) => handleLoanTenureChange(e.target.value)}
                                className="w-full mt-3 accent-blue-500"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                EMI Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => handleStartDateChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>


                        
                    </div>

                    <div className="space-y-6">
                        {/* Results */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 space-y-4">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">Calculation Results</h3>

                            <div className="flex justify-between items-center py-2 border-b border-orange-200">
                                <span className="text-sm font-medium text-gray-700">Monthly EMI:</span>
                                <span className="text-xl font-bold text-blue-700">
                                    {formatCurrency(results.monthlyEMI)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-orange-200">
                                <span className="text-sm font-medium text-gray-700">Yearly EMI Payment:</span>
                                <span className="text-lg font-semibold text-gray-800">
                                    {formatCurrency(results.yearlyPayment)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-orange-200">
                                <span className="text-sm font-medium text-gray-700">Total Interest:</span>
                                <span className="text-lg font-semibold text-gray-800">
                                    {formatCurrency(results.totalInterest)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-orange-200">
                                <span className="text-sm font-medium text-gray-700">Total Payment (Principal + Interest):</span>
                                <span className="text-lg font-semibold text-gray-800">
                                    {formatCurrency(results.totalPayment)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-medium text-gray-700">First EMI Date:</span>
                                <span className="text-lg font-semibold text-gray-800">
                                    {formatDate(results.firstEMIDate)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EMICalculator;