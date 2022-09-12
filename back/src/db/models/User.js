import { UserModel } from "../schemas/user";

class User {
  static async create({ newUser }) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  static async findByEmail({ email }) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  static async findById({ user_id }) {
    const user = await UserModel.findOne({ id: user_id });
    return user;
  }

  static async findAllNetwork(id, page, perPage) {
    const user = await UserModel.aggregate([
      {
        $lookup: {
          from: 'likes',
          let: {
            id: "$id",
          },
          pipeline: [{
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$targetUserId", "$$id" ] },
                  { $eq: ["$userId", id ] }
                ]
              }
            }
          }],
          as: 'like'
        },
      },
    ]).sort({ createdAt: "desc" })
      .skip(perPage * (page - 1))
      .limit(perPage);

    return user;
  }

  static async findMaxLike() {
    const users = await UserModel.find().sort({"likeCount":-1}).limit(1)
    return users;
  }


  static async update({ user_id, fieldToUpdate, newValue, operator }) {
    const filter = { id: user_id };
    const update = operator === 'increase' ? { $inc: { [fieldToUpdate]: newValue } } : { [fieldToUpdate]: newValue }
    const option = { returnOriginal: false };

    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedUser;
  }

}

export { User };
