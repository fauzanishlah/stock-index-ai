interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal = ({ isOpen, onClose }: UserProfileModalProps) => {
  const handleOnClose = () => {
    console.log("Close");
    onClose();
  };

  return (
    <div
      className={`${isOpen ? "block" : "hidden"} relative z-10`}
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <div className="pointer-events-auto relative w-screen max-w-md">
              <div className="absolute top-0 right-0 -mr-8 flex pt-4 pl-2 sm:-mr-10 sm:pl-4">
                <button
                  onClick={handleOnClose}
                  type="button"
                  className="relative rounded-md text-red-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
                >
                  <span className="absolute -inset-2.5"></span>
                  <span className="sr-only">Close panel</span>
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="sticky top-0 px-4 sm:px-6 bg-red-700">
                  <h2
                    className="text-base font-semibold text-gray-900"
                    id="slide-over-title"
                  >
                    Panel title
                  </h2>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  lorem1000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
