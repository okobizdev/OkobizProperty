import ContactForm from "@/components/contact/contactContainer/ContactForm";
import ContactHeader from "@/components/contact/contactContainer/ContactHeader";
import ContactInfo from "@/components/contact/contactContainer/ContactInfo";
import React from "react";

const Contact = () => {
  return (
    <div className="max-w-6xl mx-auto py-4 md:py-6 ">
      <ContactHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:py-10 ">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
