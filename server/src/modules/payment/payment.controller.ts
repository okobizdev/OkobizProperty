import Payment from "./payment.model";

const getAllPayments = async (req: any, res: any) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { getAllPayments };