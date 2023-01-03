import { IStaffProfile } from "@toboggan-ws/toboggan-common";

const staffProfile: IStaffProfile = {
    uuid: '1234567890',
    firstName: 'Down',
    lastName: 'Hall',
    preferredName: 'Down Hall',
    preferredPronoun: 'she/her/hers',
    bio: `Filled: This text area can hold longer lengths of content that the user inputs.Filled: This text area can hold longer lengths of 
      Filled: This text area can hold longer lengths of content that the user inputs.Filled: This text area can hold longer lengths of`,
    email: 'abc@test.com',
    phoneNumber: '(365) 123-4453',
    inboxes: 'instructors@snhu.edu'
};

export const mockStaffProfile = staffProfile;