import 'package:flutter/material.dart';

class ConversationItem extends StatelessWidget {
  final String imagePath;
  final String userName;
  final String lastMessageTime;

  const ConversationItem({
    super.key,
    required this.imagePath,
    required this.userName,
    required this.lastMessageTime,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration:
          const BoxDecoration(border: Border(bottom: BorderSide(width: 1.0))),
      child: Row(
        children: [
          // Circular Image
          CircleAvatar(
            radius: 25,
            backgroundImage: AssetImage(imagePath),
          ),
          const SizedBox(width: 12), // Spacing between image and text

          // Username and Last Message Time
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Username
                Text(
                  userName,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                // Last Message Time
                Text(
                  lastMessageTime,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
