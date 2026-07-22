function RideCompleteModal({ ride, driver, onClose, onSubmitReview }) {
    const [rating, setRating] = React.useState(0);
    const [hoveredRating, setHoveredRating] = React.useState(0);
    const [feedback, setFeedback] = React.useState('');
    const [step, setStep] = React.useState('success'); // Payment is already confirmed by admin
    
    const totalFareStr = ride.objectData.Fare || '₦1500';
    const totalFareNum = parseInt(totalFareStr.replace(/[^0-9]/g, ''), 10) || 1500;
    const baseFare = Math.floor(totalFareNum * 0.3);
    const timeDistFare = totalFareNum - baseFare;

    const handleFinish = async (isSkip = false) => {
        if (isSkip) {
            const skips = parseInt(localStorage.getItem('fineride_rating_skips') || '0', 10) + 1;
            localStorage.setItem('fineride_rating_skips', skips.toString());
            await onSubmitReview(0, '', true);
        } else {
            await onSubmitReview(rating || 5, feedback, false);
        }
        window.location.href = 'profile.html?tab=history';
    };

    if (!ride) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" data-name="ride-complete-modal" data-file="components/RideCompleteModal.js">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                {step === 'success' && (
                    <div className="animate-fade-in flex flex-col">
                        <div className="bg-green-500 p-6 text-white text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                <div className="icon-circle-check text-4xl text-white"></div>
                            </div>
                            <h2 className="text-2xl font-bold">Payment Confirmed!</h2>
                            <p className="text-green-50">A receipt has been sent to your email.</p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 border border-gray-200">
                                <div className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <div className="icon-receipt text-blue-600"></div> Fare Breakdown
                                </div>
                                <div className="flex justify-between"><span className="text-gray-500">Base Fare:</span> <span className="font-medium">₦{baseFare.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Time & Distance:</span> <span className="font-medium">₦{timeDistFare.toLocaleString()}</span></div>
                                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-900">
                                    <span>Total Paid:</span> <span className="text-xl">{totalFareStr}</span>
                                </div>
                            </div>

                            <div className="text-center pt-2 border-t border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-3">How was your ride?</h3>
                                <div className="flex justify-center gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <div className={`icon-star text-4xl transition-colors ${
                                                (hoveredRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                            }`}></div>
                                        </button>
                                    ))}
                                </div>
                                
                                <textarea 
                                    placeholder="Leave feedback for the admin team (optional)..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black mb-4 resize-none h-24"
                                ></textarea>
                                
                                <div className="flex gap-3">
                                    <button onClick={() => handleFinish(true)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">
                                        Skip
                                    </button>
                                    <button onClick={() => handleFinish(false)} className="flex-1 btn-black py-4">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
