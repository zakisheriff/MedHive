import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        orgName: '',
        email: '',
        inquiry: ''
    });
    const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ orgName: '', email: '', inquiry: '' });
            } else {
                console.error("Submission failed");
                alert("Something went wrong. Please ensure the backend server is running.");
                setStatus('idle');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong. Please check your connection.");
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <div className="contact-form-success animate-fade-in">
                <div className="success-icon-wrapper">
                    <i className="fa-solid fa-check"></i>
                </div>
                <h3>Inquiry Received</h3>
                <p>Thank you for reaching out, {formData.orgName}.<br />Our business team will contact you shortly at {formData.email}.</p>
                <button
                    className="btn-reset-form"
                    onClick={() => {
                        setStatus('idle');
                        setFormData({ orgName: '', email: '', inquiry: '' });
                    }}
                >
                    Send another inquiry
                </button>
            </div>
        );
    }

    return (
        <form className="contact-form glass-panel" onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    name="orgName"
                    placeholder="Organization Name"
                    value={formData.orgName}
                    onChange={handleChange}
                    required
                    className="form-input"
                    disabled={status === 'submitting'}
                />
            </div>
            <div className="form-group">
                <input
                    type="email"
                    name="email"
                    placeholder="Work Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    disabled={status === 'submitting'}
                />
            </div>
            <div className="form-group">
                <textarea
                    name="inquiry"
                    placeholder="How can we help you?"
                    value={formData.inquiry}
                    onChange={handleChange}
                    required
                    className="form-input form-textarea"
                    rows="3"
                    disabled={status === 'submitting'}
                ></textarea>
            </div>
            <button
                type="submit"
                className={`btn-cta btn-submit ${status === 'submitting' ? 'loading' : ''}`}
                disabled={status === 'submitting'}
            >
                {status === 'submitting' ? (
                    <>
                        <span className="spinner"></span> Sending...
                    </>
                ) : (
                    'Send Inquiry'
                )}
            </button>
        </form>
    );
};

export default ContactForm;
