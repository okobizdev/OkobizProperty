"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input, message, Button, Flex } from "antd";
import { contactSubmitFormApi } from "@/services/contact";
import { ContactFormValues } from "@/types/contactFormtypes";

const { TextArea } = Input;

const initialFormValues: ContactFormValues = {
  firstName: "",
  subject: "",
  email: "",
  phone: "",
  message: "",
  area: "",
  thana: "",
  district: "",
  property_size: "",
  property_size_unit: "",
  budget: "",
};

const ContactForm = () => {
  const [formValues, setFormValues] =
    useState<ContactFormValues>(initialFormValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormValues((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = () => {

    return (
      formValues.firstName.trim() !== "" &&
      formValues.subject.trim() !== "" &&
      formValues.email.trim() !== "" &&
      formValues.phone.trim() !== "" &&
      formValues.message.trim() !== ""
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) {
      message.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", formValues.firstName);
    formData.append("subject", formValues.subject);
    formData.append("email", formValues.email);
    formData.append("phone", formValues.phone);
    formData.append("message", formValues.message);
    if (formValues.area) formData.append("area", formValues.area);
    if (formValues.thana) formData.append("thana", formValues.thana);
    if (formValues.district) formData.append("district", formValues.district);
    if (formValues.property_size) formData.append("property_size", formValues.property_size);
    if (formValues.property_size_unit) formData.append("property_size_unit", formValues.property_size_unit);
    if (formValues.budget) formData.append("budget", formValues.budget);

    try {
      const result = await contactSubmitFormApi(formData);
      if (result.status == "success") {
        messageApi.success(result?.message || "Message sent successfully!");
        setFormValues(initialFormValues);
      } else {
        messageApi.error("Something went wrong!");
      }
    } catch (error) {
      message.error("Network error!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {contextHolder}
      <Flex vertical gap={20}>
        <div className='grid grid-cols-2 gap-4 mb-5 bg-[#FFFFFF] py-10 px-4 md:px-8"'>
          <Input
            name="firstName"
            placeholder="Name"
            value={formValues.firstName}
            onChange={handleChange}
            required
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              fontSize: "16px",
            }}
          />
          <Input
            name="subject"
            placeholder="Subject"
            value={formValues.subject}
            onChange={handleChange}
            required
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              fontSize: "16px",
            }}
          />
          <Input
            name="email"
            placeholder="Email"
            value={formValues.email}
            onChange={handleChange}
            required
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              fontSize: "16px",
            }}
          />
          <Input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={formValues.phone}
            onChange={handleChange}
            required
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              fontSize: "16px",
            }}
          />

          <Input
            name="area"
            placeholder="Area"
            value={formValues.area}
            onChange={handleChange}
            style={{ paddingTop: "12px", paddingBottom: "12px", fontSize: "16px" }}
          />
          <Input
            name="thana"
            placeholder="Thana"
            value={formValues.thana}
            onChange={handleChange}
            style={{ paddingTop: "12px", paddingBottom: "12px", fontSize: "16px" }}
          />
          <Input
            name="district"
            placeholder="District  "
            value={formValues.district}
            onChange={handleChange}
            style={{ paddingTop: "12px", paddingBottom: "12px", fontSize: "16px" }}
          />
          <Input
            name="property_size"
            placeholder="Property Size (Approx.)"
            value={formValues.property_size}
            onChange={handleChange}
            style={{ paddingTop: "12px", paddingBottom: "12px", fontSize: "16px" }}
          />
          <select
            name="property_size_unit"
            value={formValues.property_size_unit}
            onChange={handleChange}
            style={{ paddingTop: "12px", paddingBottom: "12px", fontSize: "16px", border: '1px solid #d9d9d9', borderRadius: 4 }}
          >
            <option className="text-gray-500" value="">Select Unit </option>
            <option value="decimal">Decimal</option>
            <option value="square_feet">Square Feet</option>
            <option value="katha">Katha</option>
            <option value="bigha">Bigha</option>
            <option value="acre">Acre</option>
            <option value="hector">Hector</option>
            <option value="square_meter">Square Meter</option>
          </select>
          <Input
            name="budget"
            placeholder="Budget (Approx.)"
            value={formValues.budget}
            onChange={handleChange}
            style={{ paddingTop: "12px", paddingBottom: "12px", fontSize: "16px" }}
          />
          <div className="col-span-2">
            <TextArea
              name="message"
              maxLength={100}
              placeholder="Please write your details here..."
              value={formValues.message}
              onChange={handleChange}
              rows={2}
              required
              style={{
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "1px solid #d9d9d9",
                borderRadius: "0",
                boxShadow: "none",
                fontSize: "16px",
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            style={{
              backgroundColor: "#014785",
              color: "white",
              padding: "14px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </Flex>
    </form>
  );
};

export default ContactForm;
