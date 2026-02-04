import { CheckCircle, BookOpen, Phone, Download } from "lucide-react";

export default function ThankYouBlackbook() {
  const handleRedownload = () => {
    const link = document.createElement('a');
    link.href = '/api/download-book';
    link.download = 'the-black-book-of-franchising.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#1E2B42] flex flex-col">
      <a 
        href="tel:9198273921" 
        className="bg-[#D4AF37] text-[#1E2B42] py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#c9a432] transition-colors"
        data-testid="button-call-top"
      >
        <Phone size={18} className="animate-pulse" />
        <span className="font-bold text-sm">Call Now: (919) 827-3921</span>
      </a>
      
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-4">
              Your Download is Ready!
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              The Black Book of Franchising has been sent to your downloads.
            </p>
          </div>

          <button
            onClick={handleRedownload}
            className="bg-[#D4AF37] hover:bg-[#c9a432] text-[#1E2B42] font-bold py-3 px-6 rounded-lg transition-all duration-200 inline-flex items-center gap-2 mb-8"
            data-testid="button-redownload"
          >
            <Download size={20} />
            Download Again
          </button>

          <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-[#D4AF37]" />
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37]">
                What's Next?
              </h2>
            </div>
            <ul className="space-y-4 text-left text-gray-300">
              <li className="flex items-start gap-3">
                <span className="bg-[#D4AF37] text-[#1E2B42] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
                <span>Read The Black Book — especially Chapter 1 on the "Mirror and Mountain"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-[#D4AF37] text-[#1E2B42] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
                <span>Ask yourself the hard questions about your motivation for franchise ownership</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-[#D4AF37] text-[#1E2B42] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
                <span>When you're ready, schedule a free consultation to explore your options</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#D4AF37]/10 backdrop-blur rounded-xl p-6 border border-[#D4AF37]/30">
            <p className="text-white font-semibold mb-2">Ready to Take the Next Step?</p>
            <p className="text-gray-300 text-sm mb-4">
              Book a free, confidential consultation with Charles to discuss your franchise journey.
            </p>
            <a 
              href="https://calendly.com/charles-stovall/intro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#1E2B42] font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
            >
              Book a Free Consultation
            </a>
          </div>

          <div className="mt-8">
            <p className="text-gray-400 text-sm">
              Questions? Call <a href="tel:9198273921" className="text-[#D4AF37] hover:underline">(919) 827-3921</a>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-gray-500 text-sm">
              Charles Stovall | Franchise Owner | Advisor | Advocate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
