"use server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string);
export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    to,
    subject,
    html,
  };
  return { transporter, mailOptions };
};

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 401 };
    }

    const userExist = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    });

    if (userExist) {
      return { status: 200, user: userExist };
    }

    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (newUser) {
      return { status: 201, user: newUser };
    }

    return { status: 400 };
  } catch (error) {
    return { status: 500 };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401 };
    }

    const notifications = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });

    if (notifications && notifications.notification.length) {
      return { status: 200, notifications };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401 };
    }

    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { lastname: { contains: query } },
          { email: { contains: query } },
        ],
        NOT: [{ clerkid: user.id }],
      },
      select: {
        id: true,
        subscription: { select: { plan: true } },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    });

    if (users && users.length) {
      return { status: 200, users };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const getPaymentInfo = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401 };

    const payment = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: { plan: true },
        },
      },
    });
    if (payment) {
      return { status: 200, payment };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 401 };

    const view = await client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        firstView: state,
      },
    });

    if (view) {
      return { status: 200, message: "Setting updated" };
    }
    return { status: 400, message: "Failed to update" };
  } catch (error) {
    return { status: 500 };
  }
};

export const getFirstView = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401 };
    const userData = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        firstView: true,
      },
    });
    if (userData) {
      return { status: 200, firstView: userData.firstView };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const getUserProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401 };
    const profile = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    });

    if (profile) return { status: 200, profile };
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const getVideoComments = async (Id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    });

    return { status: 200, comments };
  } catch (error) {
    return { status: 500 };
  }
};

export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      });
      if (reply) {
        return { status: 200, data: "Reply posted" };
      }
    }

    const newComment = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    });
    if (newComment) return { status: 200, data: "New comment added" };
  } catch (error) {
    return { status: 500 };
  }
};

export const inviteMembers = async (
  workspaceId: string,
  recieverId: string,
  email: string
) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, message: "User not found" };

    // Fetch sender details
    const senderInfo = await client.user.findUnique({
      where: { clerkid: user.id },
      select: { id: true, firstname: true, lastname: true },
    });

    if (!senderInfo) return { status: 404, message: "Sender not found" };

    // Fetch workspace details
    const workspace = await client.workSpace.findUnique({
      where: { id: workspaceId },
      select: { name: true },
    });

    if (!workspace) return { status: 404, message: "Workspace not found" };

    // Fetch recipient details
    const recipientInfo = await client.user.findUnique({
      where: { id: recieverId },
      select: { firstname: true, lastname: true },
    });

    if (!recipientInfo) return { status: 404, message: "Recipient not found" };

    // Create invitation
    const invitation = await client.invite.create({
      data: {
        senderId: senderInfo.id,
        recieverId,
        workSpaceId: workspaceId,
        content: `You are invited to join ${workspace.name} Workspace, click accept to confirm.`,
      },
      select: { id: true },
    });

    if (!invitation) return { status: 400, message: "Invitation failed" };

    // Create notification for the recipient
    await client.user.update({
      where: { id: recieverId },
      data: {
        notification: {
          create: {
            content: `${senderInfo.firstname ?? "Unknown"} ${
              senderInfo.lastname ?? ""
            } invited you to join ${workspace.name}.`,
          },
        },
      },
    });

    // Send invitation email
    try {
      const { transporter, mailOptions } = await sendEmail(
        email,
        "You got an invitation",
        `<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; text-align: center;">
    <div style=" margin: auto; background: #ffffff; border-radius: 16px; box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1); padding: 40px 20px;">
      
      <!-- Opra Logo -->
      <img src="https://res.cloudinary.com/dt7mnfm6r/image/upload/v1739801435/vzb4nfdagyzxjj2j3liw.png" alt="Opra Logo" 
        style="width: 80px; margin-bottom: 20px;">

      <!-- Heading -->
      <h1 style="color: #333; font-size: 28px; font-weight: bold; margin-bottom: 7px;">You're Invited to Join</h1>
      <h2 style="color: #007bff; font-size: 26px; margin-top: 0; font-weight: 600;">${
        workspace.name
      } on Opra</h2>

      <!-- Invitation Message -->
      <p style="color: #444; font-size: 18px; line-height: 1.6; margin-bottom: 15px;">
        <strong>${senderInfo.firstname} ${
          senderInfo.lastname
        }</strong> has invited you to collaborate in the workspace 
        <strong>${workspace.name}</strong> on Opra. 
      </p>

      <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        Opra makes team communication smoother with async video messaging. Join now and start collaborating!
      </p>

      <!-- Call to Action Button -->
      <a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" 
        style="background: linear-gradient(135deg, #007bff, #0056b3); color: #ffffff; padding: 16px 40px; border-radius: 10px; 
               text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block; 
               box-shadow: 0px 4px 12px rgba(0, 123, 255, 0.3); transition: all 0.3s ease-in-out;">
        Accept Invitation
      </a>

      <!-- Subtle Note -->
      <p style="color: #888; font-size: 14px; margin-top: 30px;">
        If you didn’t request this invitation, you can safely ignore this email.
      </p>

      <!-- Footer -->
      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
      <p style="color: #aaa; font-size: 13px;">
        Opra Team &copy; ${new Date().getFullYear()} | <a href="https://your-Opra-website.com" style="color: #007bff; text-decoration: none;">Visit Opra</a>
      </p>
    </div>
  </body>
</html>`
      );

      await transporter.sendMail(mailOptions);
    } catch (error) {
      return { status: 400, message: "Invite failed" };
    }

    return { status: 200, message: "Invite sent" };
  } catch (error) {
    return { status: 500, message: "Oops! Something went wrong" };
  }
};

export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser();
    if (!user)
      return {
        status: 401,
      };
    const invitation = await client.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        reciever: {
          select: {
            clerkid: true,
          },
        },
      },
    });

    if (user.id !== invitation?.reciever?.clerkid) return { status: 403 };
    const acceptInvite = client.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
      },
    });

    const updateMember = client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    });

    const membersTransaction = await client.$transaction([
      acceptInvite,
      updateMember,
    ]);

    if (membersTransaction) {
      return { status: 200 };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 500 };
  }
};

export const sendEmailForFirstView = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    // Fetch the video along with its owner details
    const video = await client.video.findUnique({
      where: { id: videoId },
      select: {
        title: true,
        views: true,
        User: {
          select: {
            email: true,
            clerkid: true,
            firstView: true,
          },
        },
        WorkSpace: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!video) return { status: 404 };

    if (video.User?.clerkid === user.id) return;

    await client.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } }, // ✅ Atomic increment to avoid race conditions
    });

    // ✅ If this is the first view & owner has firstView notifications enabled
    if (video.views === 0 && video.User?.firstView) {
      const { transporter, mailOptions } = await sendEmail(
        video.User.email,
        "You got a viewer!",
        `<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px; text-align: center;">
    <div style=" background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15); margin: auto;">

      <!-- Header -->
      <h1 style="color: #333; font-size: 26px; margin-bottom: 15px;">🎉 Your Video Got Its First Viewer! 🎉</h1>

      <!-- Message -->
      <p style="color: #444; font-size: 18px; line-height: 1.8;">
        Congratulations! Your video <strong>"${
          video.title
        }"</strong> in workspace ${
          video.WorkSpace?.name
        } just received its first view on <strong>Opra</strong>.
      </p>

      

      <!-- Footer -->
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #aaa; font-size: 13px;">
        Opra Team &copy; ${new Date().getFullYear()} | <a href="https://your-Opra-website.com" style="color: #007bff; text-decoration: none;">Visit Opra</a>
      </p>
    </div>
  </body>
</html>
`
      );

      // ✅ Send email before proceeding
      await transporter.sendMail(mailOptions);

      // ✅ Create a notification for the video owner
      await client.user.update({
        where: { clerkid: video.User.clerkid },
        data: {
          notification: {
            create: {
              content: `Congratulations! Your video "${video.title}" in workspace ${video.WorkSpace?.name} just received its first view`,
            },
          },
        },
      });

      return { status: 200 };
    }

    return { status: 200 };
  } catch (error) {
    return { status: 500 };
  }
};

export const completeSubscription = async (session_id: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401 };

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session) {
      const customer = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          subscription: {
            update: {
              data: {
                customerId: session.customer as string,
                plan: "PRO",
              },
            },
          },
        },
      });
      if (customer) {
        return { status: 200 };
      }
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};
