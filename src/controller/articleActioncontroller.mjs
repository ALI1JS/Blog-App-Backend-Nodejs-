import { articleModel, clapsModel, reportModel, userModel } from "./index.mjs"


export async function Clap(req, res) {
    const { articleID } = req.body;


    try {

        const clap = await clapsModel.findOne({ ownerID: req.user.userID });

        if (!clap) {
            const newClap = new clapsModel({
                clapNum: 1,
                ownerID: req.user.userID
            })

            const saved = newClap.save();

            if (!saved)
                return res.status(201).json({ message: "not claped try again" });


            const updated = articleModel.findByIdAndUpdate(articleID, { $push: { claps: saved._id } });

            if (!updated)
                return res.status(201).json({ message: "not claped try again" })

            return res.status(200).json({ message: "Clapped successfully" });
        }

        clap.clapNum++;
        const saved = await clap.save();

        if (!saved)
            return res.status(201).json({ message: "not claped try again" });

        return res.status(200).json({ message: "claped" });

    } catch (err) {
        return res.status(201).json({ message: err.message });
    }

}

export function SaveArticle(req, res) {
    const { articleID } = req.body;

    userModel.findById({ _id: req.user.userID })
        .then((user) => {

            if (user) {
                if (user.saveList.includes(articleID))
                    Unsave(req.user.userID, articleID);
                else
                    Save(req.user.userID, articleID);
            }
            else
                return res.json({ message: "user not found" });
        })
        .catch((err) => {
            return res.json({ message: err.message });
        })
}


export async function Report(req, res) {
    const { reporterID, why } = req.body;
    const { reportedID } = req.params;

    try {


        const found = await articleModel.findById(reportedID);
        if (found) {

            const isreport = await isReport(reporterID, reportedID);

            if (!isreport) {
                const report = new reportModel({
                    why,
                    reporterID,
                    reportedID
                });

                report.save()
                    .then(async (saved) => {
                        if (saved) {
                            const updated = await userModel.findByIdAndUpdate(reporterID, { $push: { reportsList: saved._id } })

                            if (updated) {
                                return res.json({ message: "report saved" });
                            }

                            else
                                return res.json({ message: "report unsaved" });
                        }

                        else
                            return res.json({ message: "report unsaved" })
                    })
            }
            else
                return res.json({ message: "already reported" });

        }
        else
            return res.json({ message: "Not found" });


    } catch (error) {
        return res.json({ message: error.message })
    }
}


export async function UnReport(req, res) {
    const { reporterID } = req.body;
    const { unreportedID } = req.query;
    try {

        const deleted = await reportModel.findOneAndDelete({ reporterID: reporterID, reportedID: unreportedID });

        if (deleted) {
            const delFromList = await userModel.findByIdAndUpdate(reporterID, { $pull: { reportsList: deleted._id } });

            if (delFromList)
                return res.json({ message: "Report deleted successfully" });

            else
                return res.json({ message: "Report not Deleted" });

        }
        else
            return res.json({ message: "Couldn't deleted" })

    } catch (error) {
        return res.json({ message: error });
    }
}

async function isReport(reporterID, reportedID) {


    const found = await reportModel.findOne({ reporterID });

    if (found) {

        if (JSON.stringify(found.reportedID) === JSON.stringify(reportedID))
            return true;

        else
            return false;
    }

    else
        return false;

}

function Save(userID, articleID) {
    userModel.findByIdAndUpdate(userID, { $push: { saveList: articleID } })
        .then((saved) => {
            if (saved)
                return res.json({ message: "saved", });

            return res.json({ message: "the operation doesn't complete" });
        })
}

function Unsave(userID, articleID) {
    userModel.findByIdAndUpdate(userID, { $pull: { saveList: articleID } })
        .then((unsaved) => {
            if (unsaved)
                return res.json({ message: "unsaved", });

            return res.json({ message: "the operation doesn't complete" });
        })
}
