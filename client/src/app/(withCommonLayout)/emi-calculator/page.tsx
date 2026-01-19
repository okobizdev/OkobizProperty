import EMICalculator from "@/components/emiCalculator/EMICalculator";
import HomeLoanContainer from "@/components/emiCalculator/HomeLoan";

export default function EMIContainer() {
  return <div>
    <HomeLoanContainer />
    <EMICalculator />
  </div>;

}
