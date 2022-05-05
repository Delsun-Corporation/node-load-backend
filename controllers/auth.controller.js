

exports.loginController = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User has been login'
    })
}