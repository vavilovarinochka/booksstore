const ControllerException = require("../utils/ControllerException");
const knex = require("../database/db_config");
const { hash, compare } = require('bcryptjs')
const mailer = require("../utils/mailer")

// register (any)
exports.register = async ({ name, email, password }) => {
    try {
        const hashedPassword = await hash(password, 10)
        const [{ id: userId }] = await knex("users")
            .insert([{ name, email, password: hashedPassword }])
            .returning("id");
        await mailer(
            email,
            "Успешная регистрация",
            'Вы успешно зарегистрировались на сайте "Туры в англию"',
            "<b>Новая регистрация</b>"
        )
        return { userId };
    } catch (error) {
        console.error(error)
        throw new ControllerException("EMAIL_IN_USE", "Email is already in use");
    }
};

// request email confirmation (user)
exports.requestEmailConfirmation = async ({ userId }) => {
    // TODO: Generate confirmation code
    const confirmationCode = "0000";
    const [record] = await knex("users")
        .select("email_is_confirmed as emailIsConfirmed")
        .where({ id: userId });

    if (!record) {
        throw new ControllerException("NOT_FOUND", "User not been found");
    }

    if (record.emailIsConfirmed) {
        throw new ControllerException(
            "ALREADY_CONFIRMED",
            "User has already confirmed their email"
        );
    }

    await knex("users")
        .update({ email_confirmation_code: confirmationCode })
        .where({ id: userId });
    // TODO: Send email

    return {};
};

// confirm emall (any)
exports.confirmEmail = async ({ userId, confirmationCode }) => {
    const [record] = await knex("users")
        .select(
            "email_is_confirmed as emailIsConfirmed",
            "email_confirmation_code as emailConfirmationCode"
        )
        .where({ id: userId });

    if (
        !record ||
        record.emailConfirmationCode === null ||
        record.emailIsConfirmed ||
        record.emailConfirmationCode !== confirmationCode
    ) {
        throw new ControllerException(
            "FORBIDDEN",
            "Wrong userId or confirmationCode"
        );
    }

    await knex("users")
        .update({ email_is_confirmed: true, email_confirmation_code: null })
        .where({ id: userId });

    return {};
};

// login (any)
exports.login = async ({ email, password }) => {
    const [user] = await knex("users").select('id', 'password', 'role').where({ email });
    if (!user) {
        throw new ControllerException("WRONG_CREDENTIALS", "Wrong credentials");
    }
    const isCompared = await compare(password, user.password)
    if (!isCompared) return false

    return { userId: user.id, userRole: user.role };
};

// edit profile (user)
exports.editProfile = async ({ userId, name, email, password }) => {
    const [record] = await knex("users")
        .select("id", "name", "email", "password")
        .where({ id: userId });

    if (!record) {
        throw new ControllerException("NOT_FOUND", "User has not been found");
    }

    if (record.password === password) {
        throw new ControllerException("SAME_PASSWORD", "Current password and new password are the same")
    }

    const patch = {};
    if (name !== record.name) {
        patch.name = name
    };

    if (email !== record.email) {
        patch.email = email;
        patch.email_is_confirmed = false;
        patch.email_confirmation_code = "0000";
    }

    if (password) {
        patch.password = await hash(password, 10)
    };

    await knex("users").update(patch).where({ id: userId });

    return {};
};

// change role (admin)
exports.changeRole = async ({ userId, role }) => {
    const [record] = await knex("users").select("id").where({ id: userId });

    if (!record) {
        throw new ControllerException("NOT_FOUND", "User has not been found");
    }

    await knex("users").update({ role }).where({ id: userId });

    return {};
};

exports.getUserById = async ({ userId }) => {
    const [{ id, name, email, role }] = await knex("users")
        .where({ id: userId })

    if (!name) {
        throw new ControllerException("USER_NOT_FOUND", "User has not been found");
    }

    return { id, name, email, role };
};

exports.getUsersList = async (limit, offset) => {
    const record = await knex("users")
        .select("*")
        .limit(limit)
        .offset(offset);
    if (!record) {
        throw new ControllerException("USER_NOT_FOUND", "User has not been found");
    }

    return record;
};
