import StaffManagementApis from "../apis/staff.apis";

const {
  changeStaffPassword,
  changeStaffRole,
  deleteStaff,
  findAllStaffs,
  createStaff,
} = StaffManagementApis;
const StaffManagementServices = {
  processCreateStaff: async ({ payload }) => {
    try {
      const data = await createStaff({ payload });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Create Staff Service");
      }
    }
  },
  processFindAllStaff: async ({ page, role, search }) => {
    try {
      const data = await findAllStaffs({ page, role, search });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Find All Staff Service");
      }
    }
  },
  processChangeStaffPassword: async ({ id, payload }) => {
    console.log("password ==== id , payload", { id, payload });
    try {
      const data = await changeStaffPassword({ id, payload });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Staff password Change Service"
        );
      }
    }
  },
  processChangeStaffRole: async ({ id, payload }) => {
    console.log("role ==== id , payload", { id, payload });
    try {
      const data = await changeStaffRole({ id, payload });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Staff Role Change Service");
      }
    }
  },
  processDeleteStaff: async ({ id }) => {
    try {
      const data = await deleteStaff({ id });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Delete Staff Service");
      }
    }
  },
};

export default StaffManagementServices;
