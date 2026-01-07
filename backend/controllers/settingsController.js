import settingsModel from "../models/settingsModel.js";

// Get Settings
const getSettings = async (req, res) => {
    try {
        let settings = await settingsModel.findOne();
        if (!settings) {
            settings = new settingsModel();
            await settings.save();
        }
        res.json({ success: true, data: settings })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching settings" })
    }
}

// Update Settings
const updateSettings = async (req, res) => {
    try {
        const settings = await settingsModel.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json({ success: true, message: "Settings Updated", data: settings })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating settings" })
    }
}

export { getSettings, updateSettings }