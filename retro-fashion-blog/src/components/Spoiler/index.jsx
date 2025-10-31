
import "./index.scss";

const Spoiler = ({ title = "Show more", children, className = "", setIsOpen, isOpen}) => {


    return (
        <div className={`spoiler ${isOpen ? "open" : ""} ${className}`}>
            <button
                type="button"
                className="spoiler__btn"
                onClick={() => setIsOpen((o) => !o)}
                aria-expanded={isOpen}
            >
                <span className="spoiler__title">{title}</span>
                <span className="spoiler__arrow" aria-hidden="true" />
            </button>

            <div className="spoiler__content" style={{ display: isOpen ? 'block' : 'none' }}>
                {children}
            </div>
        </div>
    );
};

export default Spoiler;
